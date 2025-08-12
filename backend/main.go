package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hi")
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	type signupForm struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	signupData := signupForm{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&signupData)
	if err != nil {
		log.Println("Decoding error")
	}
	fmt.Println(signupData)
	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte("FORM RECIEVED"))
}

func backendStateCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Backend is healthy"))
}

func main() {

	// Route Definitions
	http.HandleFunc("/health", backendStateCheck)
	http.HandleFunc("/", indexHandler)
	// Route defintion End

	http.HandleFunc("/", indexHandler)

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}).Handler(http.DefaultServeMux)
	http.HandleFunc("POST /signup", testHandler)
	http.HandleFunc("GET /test", indexHandler)

	fmt.Println("Listening to 3000")
	http.ListenAndServe(":3000", handler)
}
