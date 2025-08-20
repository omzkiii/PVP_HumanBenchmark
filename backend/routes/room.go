package routes

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
)

// Some issue exist here
var RoomManager = struct {
	mu    sync.Mutex
	rooms map[string]*room
}{rooms: make(map[string]*room)}

func checkPlayer(userId string, players []*client) (*client, bool) {
	for _, player := range players {
		if player.userID == userId {
			return player, true
		}
	}
	return nil, false
}

func (match *MatchInfo) RoomHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("connecting to match")

		// Dis handle rooom IDS
		path := strings.TrimPrefix(r.URL.Path, "/room/")
		if path == "" {
			fmt.Println("BADREQUEST")
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
		// only take the first segment as id
		id := path
		if i := strings.IndexByte(path, '/'); i >= 0 {
			id = path[:i]
		}

		sub := r.Header.Get("userId")

		// allowlist (also enforces TTL via IsAllowed)
		client, ok := checkPlayer(sub, match.Players)
		if !ok {
			fmt.Println("FORBIDDED")
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, "upgrade failed", http.StatusInternalServerError)
			return
		}

		// get or create room
		RoomManager.mu.Lock()
		rm := RoomManager.rooms[id]
		if rm == nil {
			rm = newRoom()
			RoomManager.rooms[id] = rm
			go rm.run(id)
		}
		RoomManager.mu.Unlock()

		client.socket = socket
		client.room = rm

		rm.join <- client
		go client.write()
		client.read()      // blocks until socket closes
		rm.leave <- client // ensure leave on exit
	}
}
