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

		_, ok := match.Allowed[r.Header.Get("userID")]
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

		for _, client := range match.Players {
			client.socket = socket
			client.room = rm
			rm.join <- client

			go client.write()
			client.read()
		}
		// Join the room
		for _, client := range match.Players {
			rm.leave <- client
		}
	}
}
