package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
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

func RoomHandler(store *MatchStore) http.HandlerFunc {
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

        // auth
        cookie, err := r.Cookie("token")
        if err != nil {
            http.Error(w, "unauthorized", http.StatusUnauthorized)
            return
        }
        sub, err := validateToken(cookie.Value)
        if err != nil {
            http.Error(w, "unauthorized", http.StatusUnauthorized)
            return
        }

        // allowlist (also enforces TTL via IsAllowed)
        if !store.IsAllowed(id, sub.Subject) {
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

        c := &client{
            userID:  sub.Subject,
            socket:  socket,
            recieve: make(chan []byte, 16),
            room:    rm,
        }

        // Defines original user
        you := map[string]any {
            "type": "you",
            "userId": c.userID,
            "match":  id,
        }

        if b, err := json.Marshal(you); err == nil {
            select {
            case c.recieve <- b:
            default:
                _ = c.socket.WriteMessage(websocket.TextMessage, b)
            }
        }

        rm.join <- c
        go c.write()
        c.read()        // blocks until socket closes
        rm.leave <- c   // ensure leave on exit
    }
}
