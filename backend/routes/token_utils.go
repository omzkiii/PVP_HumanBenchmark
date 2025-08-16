package routes

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type Claims struct {
	jwt.RegisteredClaims
}

func validateToken(token string) (*Claims, error) {
	key := []byte("sample_key")
	t, err := jwt.ParseWithClaims(token, &Claims{}, func(t *jwt.Token) (any, error) {
		return key, nil
	})
	claims := t.Claims.(*Claims)
	return claims, err
}

func createToken(w http.ResponseWriter, username string) string {
	key := []byte("sample_key")
	claim := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:  "this server",
			Subject: username,
			// NOTE: TEST EXPIRTY TIME
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claim).SignedString(key)
	if handleError(err, w) {
		return ""
	}
	return token
}

func tokenMiddleware(next func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Cookie("token")
		req_token, err := r.Cookie("token")
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized\n"))
			fmt.Println("No cookie named token")
			return
		}

		req_claims, err := validateToken(req_token.Value)
		if handleError(err, w) {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized\n"))
			fmt.Println("Token Validation Error")
			return
		}

		fmt.Println(req_claims.ExpiresAt)
		fmt.Println(time.Now())
		if req_claims.ExpiresAt.Compare(time.Now()) == -1 {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized\n"))
			fmt.Println("Token Expired")
			return
		}

		next(w, r)
	})
}
