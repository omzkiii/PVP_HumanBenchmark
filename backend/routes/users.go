package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"golang.org/x/crypto/bcrypt"
)

type db struct {
	*database.Queries
}

func handleError(err error, w http.ResponseWriter) bool {
	if err != nil {
		fmt.Println("-------------------------------")
		http.Error(w, err.Error(), 500)
		w.Header().Add("Content-type", "text/plain; charset=utf-8")
		fmt.Println("-------------------------------")
		return true
	}
	return false
}

func (q *db) getUsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := q.GetUsers(context.Background())
	if handleError(err, w) {
		return
	}
	data, err := json.Marshal(users)
	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte(data))
}

func (q *db) signupHandler(w http.ResponseWriter, r *http.Request) {
	data := database.CreateUserParams{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&data)
	if handleError(err, w) {
		return
	}

	hashed_pw, err := bcrypt.GenerateFromPassword([]byte(data.PasswordHash), bcrypt.DefaultCost)
	if handleError(err, w) {
		return
	}

	data.PasswordHash = string(hashed_pw)

	user_id, err := q.CreateUser(context.Background(), data)
	if handleError(err, w) {
		return
	}

	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte(user_id.String()))
}

func (q *db) loginHandler(w http.ResponseWriter, r *http.Request) {
	data := database.CreateUserParams{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if handleError(err, w) {
		return
	}

	password, err := q.Login(context.Background(), data.Username)
	if handleError(err, w) {
		return
	}

	fmt.Println(data.PasswordHash)
	fmt.Println(password)

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(data.PasswordHash))
	if handleError(err, w) {
		return
	}

	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte("Logged In"))
}

func Users(queries *database.Queries) {
	q := db{
		Queries: queries,
	}
	http.HandleFunc("POST /signup", q.signupHandler)
	http.HandleFunc("POST /login", q.loginHandler)
	http.HandleFunc("GET /users", q.getUsersHandler)
}
