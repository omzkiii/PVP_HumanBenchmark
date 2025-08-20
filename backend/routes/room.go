package routes

import (
	"fmt"
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

	// forwarr is a channel that holds inconming messages that shopuld be forwarrded to the other clients
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

func (r *room) broadcast(b []byte) {
	// drop if slow
	for cli := range r.clients {
		select {
		case cli.recieve <- b:
		default:
		}
	}
}

// event loop
func (r *room) run(roomID string) {
	fmt.Println("ROOM IS OPEN")
	for {
		select {
		case c := <-r.join:
			r.clients[c] = true
			r.broadcast([]byte(fmt.Sprintf(`{"type":"system","event":"join","user":"%s"}`, c.userID)))

		case c := <-r.leave:
			delete(r.clients, c)
			r.broadcast([]byte(fmt.Sprintf(`{"type":"system","event":"leave","user":"%s"}`, c.userID)))
			if len(r.clients) == 0 {
				// delete empty room
				RoomManager.mu.Lock()
				delete(RoomManager.rooms, roomID)
				RoomManager.mu.Unlock()
				return
			}

		case msg := <-r.forward:
			r.broadcast(msg)
		}
	}
}

// Handler that establishes websocket connection
const (
	socketBufferSize  = 1024
	messageBufferSize = 256
)

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  socketBufferSize,
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
