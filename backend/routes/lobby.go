package routes

import (
	"context"
	"log"
	"net/http"
	"sync"
	"time"
)

var (
	once        sync.Once
	lobby       *Lobby
	matchStore  *MatchStore
	lobbyCancel context.CancelFunc
)

func initLobbyOnce() {
	once.Do(func() {
		matchStore = NewMatchStore(10 * time.Minute)
		lobby = NewLobby("localhost:3000", matchStore)
		ctx, cancel := context.WithCancel(context.Background())
		lobbyCancel = cancel
		go lobby.Run(ctx)
		log.Println("Lobby and MatchStore initialized")
	})
}

// Websocket / match endpoints - use closures that capture lobby / matchStore

func Lobbies() {
	http.HandleFunc("/matchmaking", func(w http.ResponseWriter, r *http.Request) {
		initLobbyOnce() // Lobby must initialzie once
		if lobby == nil {
			http.Error(w, "Lobby not initialized", http.StatusInternalServerError)
			return
		}
		h := authMiddleware(LobbyWSHandler(lobby)) // form lobby.go
		h.ServeHTTP(w, r)
	})

	// HANDLES ROOM
	http.HandleFunc("/room/", func(w http.ResponseWriter, r *http.Request) {
		authMiddleware(RoomHandler(matchStore)).ServeHTTP(w, r)
	})
}
