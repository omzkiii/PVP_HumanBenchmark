package main

import (
	"fmt"
	"net/http"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World")
}

func main() {
	http.HandleFunc("/", indexHandler)
	fmt.Println("Listening to 8000")
	http.ListenAndServe(":8000", nil)
}
