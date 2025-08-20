package routes

import (
	"net/http"
	"strings"
	"sync"
)

// Some issue exist here
var RoomManager = struct {
	mu    sync.Mutex
	rooms map[string]*room
}{rooms: make(map[string]*room)}

func (match *MatchInfo) RoomHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// path /room/{id}
		id := strings.TrimPrefix(r.URL.Path, "/room/")
		if id == "" {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		// validate cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		userID, err := validateToken(cookie.Value)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		// check match allowlist

		_, ok := match.Allowed[userID.Subject]
		if !ok {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		// Lookup or create room
		RoomManager.mu.Lock()
		rm, ok := RoomManager.rooms[id]
		if !ok {
			rm = newRoom()
			RoomManager.rooms[id] = rm
			go rm.run()
		}
		RoomManager.mu.Unlock()

		// Upgrade connection to WebSocket
		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, "upgrade failed", http.StatusInternalServerError)
			return
		}

		// Create a NEW client for this socket
		c := &client{
			userID:  userID.Subject,
			socket:  socket,
			recieve: make(chan []byte, 16),
			room:    rm,
		}

		// join the room
		rm.join <- c

		// writer in background, reader blocks
		go c.write()
		c.read()

		// when read() returns, ensure leave
		rm.leave <- c
	}
}
