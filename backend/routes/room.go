package routes

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type room struct {

	// clients holds all current clients in this room
	clients map[*client]bool

	// join is a channel for clients withsin to join the room
	join chan *client

	// leave is a channel for clients wishin to leave the room
	leave chan *client

	//forwarr is a channel that holds inconming messages that shopuld be forwarrded to the other clients
	forward chan []byte
}


// New Room Constructor
func newRoom() *room {
	return &room{
		forward: make(chan []byte),
		join:    make(chan *client),
		leave:   make(chan *client),
		clients: make(map[*client]bool),
	}
}

// A continuous loop with a select statement that listens for changes in rooms
func (r *room) run() {
	for {
		select {
		case client := <-r.join:
			r.clients[client] = true
		case client := <-r.leave:
			delete(r.clients, client)
			close(client.recieve)
		case msg := <-r.forward: // Listens to messages
			for client := range r.clients {
				client.recieve <- msg
			}

		}
	}
}

// Handler that establishes websocket connection
const (
	socketBufferSize  = 1024
	messageBufferSize = 256
)

var upgrader = &websocket.Upgrader{
	ReadBufferSize: socketBufferSize, 
	WriteBufferSize: messageBufferSize,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (r *room) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	log.Println("ServeHTTP hit for /room")
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil { // Check if error exist
		log.Fatal("ServeHTTP", err)
		return
	}
	client := &client{
		socket:  socket,
		recieve: make(chan []byte, messageBufferSize),
		room:    r,
	}
	r.join <- client
	defer func() { r.leave <- client }()
	go client.write()
	client.read()
}
