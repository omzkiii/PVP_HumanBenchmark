package routes

import (
	"fmt"
	"net/http"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hi")
	fmt.Println("CONNECTED")
}

func backendStateCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Backend is healthy"))
}

func Tests() {
	http.HandleFunc("/health", backendStateCheck)
	http.HandleFunc("/", indexHandler)
}
