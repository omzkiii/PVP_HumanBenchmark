package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
)

func Users(queries *database.Queries) {
	q := db{
		Queries: queries,
	}
	http.HandleFunc("POST /signup", q.signupHandler)
	http.HandleFunc("POST /login", q.loginHandler)
	http.HandleFunc("POST /logout", q.logoutHandler)
	http.Handle("GET /users", authMiddleware(q.getUsersHandler))
	http.Handle("GET /auth", authMiddleware(authHandler))
	http.Handle("GET /me", authMiddleware(q.meHandler)) // Temp func For handling single user verification
}

// HANDLERS
type db struct {
	*database.Queries
}

func handleError(err error, w http.ResponseWriter) bool {
	if err != nil {
		fmt.Println("-----error-----")
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		w.Header().Add("Content-type", "text/plain; charset=utf-8")
		fmt.Println("---------------")
		return true
	}
	return false
}

// user Checkers
func (q *db) getUsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := q.GetUsers(context.Background())
	if handleError(err, w) {
		return
	}
	data, err := json.Marshal(users)
	if handleError(err, w) {
		return
	}

	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(data))
}

func (q *db) meHandler(w http.ResponseWriter, r *http.Request) {
	// TokenMiddleware Validation
	reqToken, err := r.Cookie("token") // Look at request call and take token
	fmt.Println(reqToken)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims, err := validateToken(reqToken.Value) // Take Token returns a specific Claims
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	user, err := q.GetAUser(context.Background(), claims.Subject) // Check user
	if handleError(err, w) {
		return
	}

	data, err := json.Marshal(user)
	if handleError(err, w) {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
}
