package routes

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/omzkiii/PVP_HumanBenchmark/backend/games"
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


	seats []string
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
			

			// define order of who goes first
			if len(r.clients) == 2 && len(r.seats) == 0 {
				ids := make([]string, 0, 2)
				for cli := range r.clients {
					ids = append(ids, cli.userID)
				}

				r.seats = shuffle(ids)

				plyrOrder := map[string]any{
					"type": "Player Order",
					"seats": r.seats,
				}
				b, _ := json.Marshal(plyrOrder)
				r.broadcast(b)
			}

		case c := <-r.leave:
			delete(r.clients, c)
			r.broadcast([]byte(fmt.Sprintf(`{"type":"system","event":"leave","user":"%s"}`, c.userID)))
			if len(r.clients) == 0 {
				// delete empty room
				RoomManager.mu.Lock()
				delete(RoomManager.rooms, roomID)
				// TODO: write the match to database
				RoomManager.mu.Unlock()
				return
			}

		case msg := <-r.forward:
			games.Handle(msg)
			r.broadcast(msg)
		}
	}
}


func shuffle(ids []string) []string {
    if len(ids) != 2 { return ids }
    n, _ := rand.Int(rand.Reader, big.NewInt(2)) // 0 or 1
    if n.Int64() == 1 {
        ids[0], ids[1] = ids[1], ids[0]
    }
    return ids
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
