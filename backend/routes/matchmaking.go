package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

var (
	once        sync.Once
	lobby       *Lobby
	matchStore  *MatchStore
	lobbyCancel context.CancelFunc
	RDClient    *redis.Client
)

func initLobbyOnce(rdClient *redis.Client) {
	once.Do(func() {
		RDClient = rdClient
		matchStore = NewMatchStore(10 * time.Minute)
		lobby = newLobby("localhost:3000", matchStore)
		ctx, cancel := context.WithCancel(context.Background())
		lobbyCancel = cancel
		go lobby.Run(ctx)
		log.Println("Lobby and MatchStore initialized")
	})
}

// Websocket / match endpoints - use closures that capture lobby / matchStore

func MatchMaking(rdClient *redis.Client) {
	http.HandleFunc("/matchmaking", func(w http.ResponseWriter, r *http.Request) {
		initLobbyOnce(rdClient) // Lobby must initialzie once
		if lobby == nil {
			http.Error(w, "Lobby not initialized", http.StatusInternalServerError)
			return
		}
		h := authMiddleware(matchMakingHandler(lobby)) // form lobby.go
		h.ServeHTTP(w, r)
	})
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

			// NOTE:TESTING REDIS
			// RDClient.HDel(context.Background(), "queue", c.userID)
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
		// NOTE:TESTING REDIS
		RDClient.SAdd(context.Background(), "queue", c.userID)
		l.Enqueue(c)

		// NOTE: TESTING REDIS
		queue, err := RDClient.SMembers(context.Background(), "queue").Result()
		fmt.Println("::::::::::::::::::::::::::::::::::::::::::::;")
		fmt.Println(queue)
		fmt.Println(err)
		fmt.Println("::::::::::::::::::::::::::::::::::::::::::::;")

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
