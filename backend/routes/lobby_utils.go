package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Lobby struct {
	mu    sync.Mutex
	queue []*client // looks for clients

	matchStore *MatchStore
	host       string // reference to websocket / localhost
	quit       chan struct{}


}

// creates a new lobby for a specific pport
func NewLobby(host string, store *MatchStore) *Lobby {
	return &Lobby{
		queue:      make([]*client, 0),
		matchStore: store,
		host:       host,
		quit:       make(chan struct{}),
	}
}

// Adds clients to game queue=
func (l *Lobby) Enqueue(c *client) {
	l.mu.Lock()
	defer l.mu.Unlock() // Always unlock


	// If this user is already queued, reject the duplicate tab.
    for _, cc := range l.queue {
        if cc.userID == c.userID { 
            // DUPLICATE CALLER TO SEND BACK TO REACT
            msg := []byte(`{"action":"duplicate","reason":"already_queued"}`)
            select { case c.recieve <- msg: default: _ = c.socket.WriteMessage(websocket.TextMessage, msg) }
            return
        }
    }

	log.Printf("Mutex locked for client: %s", c.userID)
	l.queue = append(l.queue, c)
	log.Printf("Client enqueued: %s | Queue length: %d", c.userID, len(l.queue))
}

func (l *Lobby) Remove(c *client) {
	l.mu.Lock()
	defer l.mu.Unlock()
	for i, cc := range l.queue {
		if cc == c {
			l.queue = append(l.queue[:i], l.queue[i+1:]...)
			fmt.Println("client removed from queue:", c.userID)
			return
		}
	}
}

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

		//Partner Chooser
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
        go l.createMatch([]*client{p1, p2})
    }
}


func (l *Lobby) Run(ctx context.Context) {
	ticker := time.NewTicker(150 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-l.quit:
			return
		case <-ticker.C:
			attemptMatchMaking(l)
		}
	}
}




// Stop stops the lobby loop
func (l *Lobby) stop() {
	close(l.quit)
}

// Dis handles match creation
func (l *Lobby) createMatch(players []*client) {
	matchID := uuid.NewString()

	 // Convert []*client -> []string
	 playerIDs := make([]string, len(players))
	 allowed := make(map[string]bool)
	 for i, p := range players {
		 playerIDs[i] = p.userID
		 allowed[p.userID] = true
	 }

	mi := &MatchInfo{
		ID:       matchID,
		Players:  playerIDs ,
		Allowed: allowed,
		Created:  time.Now(),
		ExpireAt: time.Now().Add(10 * time.Minute),
	}
	l.matchStore.AddMatch(mi)


	// Check this out for ID instantiation
	http.HandleFunc("/matches/", func(w http.ResponseWriter, r *http.Request) {
		h := mi.RoomHandler() // from room.go
		h.ServeHTTP(w, r)
	})

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

//

func LobbyWSHandler(l *Lobby) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// VALIDATION ======================================
		cookie, err := r.Cookie("token")
		log.Println("Matchmaking hit for request from:", r.RemoteAddr)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		userID, err := validateToken(cookie.Value)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		// =================================

		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade error:", err)
			return
		}

		c := &client{
			userID:  userID.Subject,
			socket:  socket,
			recieve: make(chan []byte, 16),
			room:    nil,
		}

		// start writer and reader
		go c.write()
		go func() {
			c.read()
			l.Remove(c)
		}()

		// enqueue them for matchmaking
		l.Enqueue(c)

		queuedMsg := map[string]string{"action": "queued"}
		b, _ := json.Marshal(queuedMsg)
		c.recieve <- b
	}
}
