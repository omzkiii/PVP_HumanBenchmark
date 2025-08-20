package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"golang.org/x/crypto/bcrypt"
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

func authHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
	w.Header().Set("Content-Type", "text/plain")
	w.Write([]byte("authenticated"))
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

	token := createToken(w, data.Username)
	http.SetCookie(w, &http.Cookie{
		Name:  "token",
		Value: token,
		// NOTE: TEST EXPIRTY TIME
		Expires:  time.Now().Add(time.Minute),
		HttpOnly: true,
		Secure:   false,
		Path:     "/",
	})
	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(user_id.String()))
}

func (q *db) loginHandler(w http.ResponseWriter, r *http.Request) {
	var err error

	data := database.CreateUserParams{}
	err = json.NewDecoder(r.Body).Decode(&data)
	if handleError(err, w) {
		return
	}
	password, err := q.Login(context.Background(), data.Username)
	if handleError(err, w) {
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(data.PasswordHash))
	if handleError(err, w) {
		return
	}

	token := createToken(w, data.Username)
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(5 * time.Hour),
		HttpOnly: true,
		Secure:   false,
		Path:     "/",
	})

	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(data.Username))
}

// Loguout Handler
func (q *db) logoutHandler(w http.ResponseWriter, r *http.Request) {
	// Expire the cookie immediately
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0), // already expired
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false, // set to true in production with HTTPS
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("logged out"))
}
