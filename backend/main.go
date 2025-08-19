package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/routes"

	"github.com/rs/cors"
)

var (
	once        sync.Once
	lobby       *routes.Lobby
	matchStore  *routes.MatchStore
	lobbyCancel context.CancelFunc
)

func initLobbyOnce() {
	once.Do(func() {
		matchStore = routes.NewMatchStore(10 * time.Minute)
		lobby = routes.NewLobby("localhost:3000", matchStore)
		ctx, cancel := context.WithCancel(context.Background())
		lobbyCancel = cancel
		go lobby.Run(ctx)
		log.Println("Lobby and MatchStore initialized")
	})
}

func main() {
	// Database
	dbpool := database.Init()
	defer dbpool.Close()

	queries := database.New(dbpool)

	// ROUTES
	routes.Users(queries)
	routes.Connector()
	routes.Tests()

	// Websocket / match endpoints - use closures that capture lobby / matchStore
	http.HandleFunc("/matchmaking", func(w http.ResponseWriter, r *http.Request) {
		initLobbyOnce() // Lobby must initialzie once 
		if lobby == nil {
			http.Error(w, "Lobby not initialized", http.StatusInternalServerError)
			return
		}
		h := routes.LobbyWSHandler(lobby) // form lobby.go
		h.ServeHTTP(w, r)

	})

	http.HandleFunc("/matches/", func(w http.ResponseWriter, r *http.Request) {
		initLobbyOnce()
		if matchStore == nil {
			http.Error(w, "Matchstore not initialized", http.StatusInternalServerError)
			return
		}
		h := routes.RoomHandler(matchStore) // from room.go
		h.ServeHTTP(w, r)
	})

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}).Handler(http.DefaultServeMux)

	fmt.Println("Listening to 3000")
	http.ListenAndServe(":3000", handler) // Only good for local devs

	// NEEDS (DONT ADD YET)
	//  - No graceful shutdown
	//  - Control Over timeouts
	//  - Harder to handle signals

}
