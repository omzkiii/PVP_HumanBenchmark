package routes

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"golang.org/x/crypto/bcrypt"
)

type db struct {
	*database.Queries
}

func handleError(err error, w http.ResponseWriter) {
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(500)
		w.Header().Add("Content-type", "text/plain; charset=utf-8")
		w.Write([]byte(err.Error()))
		return
	}
}

func (q *db) signupHandler(w http.ResponseWriter, r *http.Request) {
	data := database.CreateUserParams{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		log.Println("Decoding error")
		return
	}
	hashed_pw, err := bcrypt.GenerateFromPassword([]byte(data.PasswordHash), bcrypt.DefaultCost)
	handleError(err, w)

	data.PasswordHash = string(hashed_pw)

	user_id, err := q.CreateUser(context.Background(), data)
	handleError(err, w)

	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte(user_id.String()))
}

func Users(queries *database.Queries) {
	q := db{
		Queries: queries,
	}
	http.HandleFunc("POST /signup", q.signupHandler)
}
