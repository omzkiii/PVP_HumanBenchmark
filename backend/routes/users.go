package routes

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
)

type db struct {
	*database.Queries
}

func (q *db) signupHandler(w http.ResponseWriter, r *http.Request) {
	data := database.CreateUserParams{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		log.Println("Decoding error")
		return
	}

	user_id, err := q.CreateUser(context.Background(), data)
	if err != nil {
		w.WriteHeader(200)
		w.Header().Add("Content-type", "text/plain; charset=utf-8")
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte(user_id.String()))
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
	http.HandleFunc("POST /signup", q.signupHandler)
}
