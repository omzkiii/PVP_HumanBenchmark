package routes

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"
)

type Lobby struct {
	mu    sync.Mutex
	queue []*client // looks for clients

	matchStore *MatchStore
	host       string // reference to websocket / localhost
	quit       chan struct{}
}

// creates a new lobby for a specific port
func newLobby(host string, store *MatchStore) *Lobby {
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
