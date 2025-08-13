package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
)

type db struct {
	*database.Queries
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
	fmt.Fprintf(w, "Hello %v", signupData.Username)
}

func (q *db) getUsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := q.GetUsers(context.Background())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(users)
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err)
		w.WriteHeader(500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func Users(queries *database.Queries) {
	q := db{
		Queries: queries,
	}
	http.HandleFunc("GET /getUsers", q.getUsersHandler)
	http.HandleFunc("POST /signup", testHandler)
}
