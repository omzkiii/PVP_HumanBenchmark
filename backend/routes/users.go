package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
)

type db struct {
	pool *pgxpool.Pool
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

func (a *db) getUsersHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := a.pool.Query(context.Background(), "SELECT * FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []database.User
	for rows.Next() {
		var u database.User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, u)
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

func Users(dbpool *pgxpool.Pool) {
	a := db{
		pool: dbpool,
	}
	http.HandleFunc("GET /getUsers", a.getUsersHandler)
	http.HandleFunc("POST /signup", testHandler)
}
