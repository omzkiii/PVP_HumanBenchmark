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

func RoomHandler(store *MatchStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {

        // Dis handle rooom IDS
        path := strings.TrimPrefix(r.URL.Path, "/room/")
        if path == "" {
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

        // get or create room
        RoomManager.mu.Lock()
        rm := RoomManager.rooms[id]
        if rm == nil {
            rm = newRoom()
            RoomManager.rooms[id] = rm
            go rm.run(id)
        }
        RoomManager.mu.Unlock()

        socket, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            http.Error(w, "upgrade failed", http.StatusInternalServerError)
            return
        }
		
        c := &client{
            userID:  sub.Subject,
            socket:  socket,
            recieve: make(chan []byte, 16),
            room:    rm,
        }

        rm.join <- c
        go c.write()
        c.read()        // blocks until socket closes
        rm.leave <- c   // ensure leave on exit
    }
}
