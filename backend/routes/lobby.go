package routes

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

func attemptMatchMaking(l *Lobby) {
	var p1, p2 *client

	l.mu.Lock()
	if len(l.queue) >= 2 {
		// take the first client
		p1 = l.queue[0]

		// find a partner with a different userID (dis is to avoid self-pair / multi-tab same user)
		partnerIdx := -1
		for i := 1; i < len(l.queue); i++ {
			if l.queue[i].userID != p1.userID {
				partnerIdx = i
				break
			}
		}

		// Partner Chooser
		if partnerIdx != -1 {
			p2 = l.queue[partnerIdx]
			l.queue = append(l.queue[:partnerIdx], l.queue[partnerIdx+1:]...)
			l.queue = l.queue[1:]
		} else {
			p1 = nil
		}
	}
	l.mu.Unlock()

	if p1 != nil && p2 != nil {
		go createMatch(l, []*client{p1, p2})
	}
}

// Dis handles match creation
func createMatch(l *Lobby, players []*client) {
	matchID := uuid.NewString()

	mi := &MatchInfo{
		ID:       matchID,
		Players:  players,
		Created:  time.Now(),
		ExpireAt: time.Now().Add(10 * time.Minute),
	}
	RDClient.HSet(context.Background(), "match:"+matchID, "player1", players[0].userID, "player2", players[1].userID)

	// build ws url and path (cookies expected to be sent automatically)
	wsURL := "ws://" + l.host + "/room/" + matchID // Websocket url
	pagePath := "/matches/" + matchID              // React Redriect

	// notify each player. Use client's recieve channel so their existing writer sends it
	msgObj := map[string]string{
		"action": "switch",
		"url":    wsURL,
		"path":   pagePath,
		"match":  matchID,
	}
	data, _ := json.Marshal(msgObj)

	for _, p := range players {
		// best-effort send
		select {
		case p.recieve <- data:
		default:
			// if client.receive is full, fallback to direct write (less ideal)
			_ = p.socket.WriteMessage(websocket.TextMessage, data)
		}
		// Do NOT forcibly close p.socket here; let the client initiate reconnect.
	}
	log.Printf("match %s created for %v\n", matchID, mi.Players)
}
