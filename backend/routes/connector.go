package routes

import (
	"fmt"
	"net/http"
	"path/filepath"
	"sync"
	"text/template"
)

// templ represents a single template
type templateHandler struct {
	once     sync.Once
	filename string
	templ    *template.Template
}

// ServeHTTTP handles the HTTP requests
func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Println("/room ServeHTTP called")
	t.once.Do(func() {
		t.templ = template.Must(template.ParseFiles(filepath.Join("templates", t.filename)))
	})
	t.templ.Execute(w, r)
}

func Connector() {
	fmt.Println("Registering /room WebSocket endpoint")

	r := newRoom()
	http.Handle("/room", r)

	// Runs room GoRoutine Instanitate
	go r.run()
}
