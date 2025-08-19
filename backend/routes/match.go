package routes

import (
	"sync"
	"time"
)

// Match Info And Match Store\
type MatchInfo struct {
	ID       string
	Players  []*client       // Store a list of authorized players
	Allowed  map[string]bool // Lookup
	Created  time.Time
	ExpireAt time.Time
}

// Handles Matches in Bulk
type MatchStore struct {
	mu      sync.Mutex // Mutual Exclusion for synchornization
	matches map[string]*MatchInfo
	ttl     time.Duration
}

func NewMatchStore(ttl time.Duration) *MatchStore {
	return &MatchStore{
		matches: make(map[string]*MatchInfo), // Hashg map for type string = Match Tytpe
		ttl:     ttl,
	}
}

// Logic for finding matches
func (s *MatchStore) AddMatch(mi *MatchInfo) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.matches[mi.ID] = mi
}

func (s *MatchStore) IsAllowed(matchID, userID string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	mi, ok := s.matches[matchID] // Returns hash map
	if !ok {
		return false
	}
	// expire check
	if time.Now().After(mi.ExpireAt) {
		delete(s.matches, matchID)
		return false
	}
	return mi.Allowed[userID]
}

func (s *MatchStore) DeleteMatch(id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.matches, id)
}
