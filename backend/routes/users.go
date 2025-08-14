package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/database"
	"golang.org/x/crypto/bcrypt"
)

func Users(queries *database.Queries) {
	q := db{
		Queries: queries,
	}
	http.HandleFunc("POST /signup", q.signupHandler)
	http.HandleFunc("POST /login", q.loginHandler)
	http.HandleFunc("GET /users", q.getUsersHandler)
}

// HANDLERS

type db struct {
	*database.Queries
}

func handleError(err error, w http.ResponseWriter) bool {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		w.Header().Add("Content-type", "text/plain; charset=utf-8")
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
	w.WriteHeader(http.StatusOK)
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
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(user_id.String()))
}

func (q *db) loginHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Handle cookies
	// TESTING COOKIES
	fmt.Println(r.Cookies())

	data := database.CreateUserParams{}
	err := json.NewDecoder(r.Body).Decode(&data)
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
		Expires:  time.Now().Add(time.Hour),
		HttpOnly: true,
		Secure:   false,
		Path:     "/",
	})

	w.Header().Add("Content-type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(data.Username))
}

type Claims struct {
	jwt.RegisteredClaims
}

func validateToken(token string) *Claims {
	key := []byte("sample_key")
	t, _ := jwt.ParseWithClaims(token, &Claims{}, func(t *jwt.Token) (any, error) {
		return key, nil
	})
	claims := t.Claims.(*Claims)
	return claims
}

func createToken(w http.ResponseWriter, username string) string {
	key := []byte("sample_key")
	claim := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "this server",
			Subject:   username,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claim).SignedString(key)
	if handleError(err, w) {
		return ""
	}
	return token
}
