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
		// path /room/{id}
		id := strings.TrimPrefix(r.URL.Path, "/room/")
		if id == "" {
			fmt.Println("BADREQUEST")
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		client, ok := checkPlayer(r.Header.Get("userId"), match.Players)
		if !ok {
			fmt.Println("FORBIDDEN")
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, "upgrade failed", http.StatusInternalServerError)
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

		client.socket = socket
		fmt.Println(client.userID, "joined the room")
		client.room = rm
		rm.join <- client

		go client.write()
		client.read()

		rm.leave <- client
	}
}
