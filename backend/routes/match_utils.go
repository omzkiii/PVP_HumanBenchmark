package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// Match Info\
type MatchInfo struct {
	ID       string
	Players  []*client // Store a list of authorized players
	Created  time.Time
	ExpireAt time.Time
}

func matchMakingHandler(l *Lobby) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade error:", err)
			return
		}

		c := &client{
			userID:  r.Header.Get("userID"),
			socket:  socket,
			recieve: make(chan []byte, 16),
			room:    nil,
		}

		// start writer and reader
		go c.write()
		go func() {
			c.read()

			l.Remove(c)
		}()

		// If this user is already queued, reject the duplicate tab.
		if isQueued(l, c) {
			msg := []byte(`{"action":"duplicate","reason":"already_queued"}`)
			select {
			case c.recieve <- msg:
			default:
				_ = c.socket.WriteMessage(websocket.TextMessage, msg)
			}
			return
		}
		l.Enqueue(c)

		queuedMsg := map[string]string{"action": "queued"}
		b, _ := json.Marshal(queuedMsg)
		c.recieve <- b
	}
}

func isQueued(lobby *Lobby, client *client) bool {
	for _, c := range lobby.queue {
		if client.userID == c.userID {
			return true
		}
	}
	return false
}
