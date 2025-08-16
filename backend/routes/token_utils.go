package routes

import (
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
