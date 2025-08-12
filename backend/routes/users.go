package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

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
	w.Write([]byte(fmt.Sprintf("Hello %v", signupData.Username)))
}

func Users() {
	http.HandleFunc("POST /signup", testHandler)
}
