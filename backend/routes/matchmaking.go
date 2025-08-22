package routes

import (
	"context"
	"log"
	"net/http"
	"sync"

	"github.com/redis/go-redis/v9"
)

var (
	once        sync.Once
	lobby       *Lobby
	lobbyCancel context.CancelFunc
	RDClient    *redis.Client
)

func initLobbyOnce(rdClient *redis.Client) {
	once.Do(func() {
		RDClient = rdClient
		lobby = newLobby("localhost:3000")
		ctx, cancel := context.WithCancel(context.Background())
		lobbyCancel = cancel
		go lobby.Run(ctx)
		log.Println("Lobby initialized")
	})
}

// Websocket / match endpoints - use closures that capture lobby
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
	http.Handle("/room/", authMiddleware(RoomHandler()))
}
