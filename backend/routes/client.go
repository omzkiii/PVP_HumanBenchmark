package routes

import (
	"encoding/json"
	"time"

	"github.com/gorilla/websocket"
)

// Inbound messages, DIS handles in client message flwo
type Inbound struct {
	Type    string          `json:"type"`
	Action  string          `json:"action,omitempty"`
	Payload json.RawMessage `json:"payload,omitempty"`
	Seq     uint64          `json:"seq,omitempty"`
	Text    string          `json:"text,omitempty"`
}

// the server-side representation of a connected user session
type client struct { // Like an object

	// Add user Id specifically for P2P interaction keep userID same for global room
	userID string

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
		_, raw, err := c.socket.ReadMessage()
		if err != nil {
			return
		}

		if c.room != nil {
			var inbInst Inbound // declare emptyInbound
			if err := json.Unmarshal(raw, &inbInst); err == nil && inbInst.Type != "" {
				switch inbInst.Type {
				case "chat":
					// Send normal chat json
					msg := map[string]any{
						"type": "chat",
						"from": c.userID,
						"text": inbInst.Text,
						"ts":   time.Now().UTC().Format(time.RFC3339Nano),
					}

					b, _ := json.Marshal(msg) // extract json
					c.room.forward <- b

				case "action":
					// Send action json
					output := map[string]any{
						"type":    "action",
						"from":    c.userID,
						"action":  inbInst.Action,
						"payload": json.RawMessage(inbInst.Payload),
						"seq":     inbInst.Seq,
						"ts":      time.Now().UTC().Format(time.RFC3339Nano),
					}

					b, _ := json.Marshal(output) // extract json
					c.room.forward <- b
				default:
				}
				continue
			}

			// Ultimate ELSE CATCHER, if all checks fail just treat as normal
			msg := map[string]any{
				"type": "chat",
				"from": c.userID,
				"text": string(raw),
				"ts":   time.Now().UTC().Format(time.RFC3339Nano),
			}
			b, _ := json.Marshal(msg)
			c.room.forward <- b

		}

	}
}

func (c *client) write() {
	defer c.socket.Close()
	for msg := range c.recieve {
		if err := c.socket.WriteMessage(websocket.TextMessage, msg); err != nil {
			return
		}
	}
}
