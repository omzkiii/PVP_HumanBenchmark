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
	fmt.Println("Listening to 3000")
	http.ListenAndServe(":3000", nil)
}
