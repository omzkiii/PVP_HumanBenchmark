package routes

import (
	"github.com/gorilla/websocket"
)

type client struct { // Like an object
	

	// socket is the wewb scoket for this client
	socket *websocket.Conn

	// recieve is a channel to recieve messages from other clients
	recieve chan []byte

	// room is the room this client is chatting in
	room *room

}



func (c *client) read() {
	// Handle in which the user is sending a message to the room

	defer c.socket.Close()
	for {
		_, msg, err := c.socket.ReadMessage()
		if err != nil {
			return
		}
		c.room.forward <- msg
	}
}

func (c* client) write() {
	defer c.socket.Close()
	for msg := range c.recieve {
		err := c.socket.WriteMessage(websocket.TextMessage, msg)
		if ( err != nil) {
			return
		}
	}

}