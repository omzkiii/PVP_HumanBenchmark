package main

import (
	"fmt"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/routes"

	"github.com/rs/cors"
)

func main() {
	// Database
	db := database.Init()
	defer db.Close()

	// ROUTES
	routes.Users(db)
	routes.Tests()

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}).Handler(http.DefaultServeMux)

	fmt.Println("Listening to 3000")
	http.ListenAndServe(":3000", handler)
}
