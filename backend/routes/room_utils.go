package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

func load_rooms() []room {
	rooms := []room{}
	for range 5 {
		rooms = append(rooms, *newRoom())
	}
	return rooms
}

func pop_room(rooms []room) room {
	popped_room := rooms[0]
	rooms = rooms[1:]
	return popped_room
}

func transfer_client(clients map[*client]bool, rooms []room) {
	url := uuid.NewString()
	path := fmt.Sprintf("ws://localhost:3000/%v", url)

	new_room := pop_room(rooms)
	http.Handle("/"+url, &new_room)
	for client := range clients {
		msg := map[string]string{
			"action": "switch",
			"url":    path,
		}
		data, _ := json.Marshal(msg)
		client.socket.WriteMessage(websocket.TextMessage, data)
	}
	for {
		select {
		case client := <-new_room.join:
			fmt.Println(client, "joined")
			new_room.clients[client] = true
		case client := <-new_room.leave:
			fmt.Println(client, "leaves")
			delete(new_room.clients, client)
			close(client.recieve)
		case msg := <-new_room.forward: // Listens to messages
			for client := range new_room.clients {
				fmt.Println("messages are being sent")
				client.recieve <- msg
			}
		}
	}
}
