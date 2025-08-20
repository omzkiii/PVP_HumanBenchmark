package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/redis"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/routes"

	"github.com/rs/cors"
)

func main() {
	// Database
	dbpool := database.Init()
	defer dbpool.Close()
	queries := database.New(dbpool)

	// Redis
	rdClient := redis.Init()
	defer rdClient.Close()
	defer rdClient.FlushAll(context.Background())

	// ROUTES
	routes.Users(queries)
	routes.Tests()
	routes.MatchMaking(rdClient)

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
