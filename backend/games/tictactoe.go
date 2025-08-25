package games

import (
	"fmt"
	"sync"
)

/** ==============================  */
// --- in-memory state per match ---
/** ==============================  */

type tttState struct {
	Board  [3][3]rune
	X      string
	O      string
	Next   string
	Winner string
}

var (
	tttMu    sync.Mutex
	tttByKey = map[string]*tttState{} // key: match key (see matchKey())
)

/** ==============================  */
// --- entry point from games.Handle ---
/** ==============================  */

func tictactoe(g game_data) []byte {
	if g.action != "move" {
		return nil
	}

	row, col, ok := parsePos(g.payload["pos"])
	if !ok || row < 0 || row > 2 || col < 0 || col > 2 {
		return nil
	}

	key := matchKey(g) // which "match/room" this belongs to

	tttMu.Lock()
	defer tttMu.Unlock()

	st := tttByKey[key]
	if st == nil {
		st = &tttState{
			Board: [3][3]rune{
				{'_', '_', '_'},
				{'_', '_', '_'},
				{'_', '_', '_'},
			},
			// seats assigned lazily below
		}
		tttByKey[key] = st
	}

	assignSeats(st, g.player)

	if st.Winner != "" {
		fmt.Printf("[ttt %s] ignored move from %s; game finished (winner=%s)\n", key, g.player, st.Winner)
		return nil
	}

	// Turn check (optional soft validation; keeps 'recognition' accurate)
	if st.Next != "" && st.Next != g.player {
		fmt.Printf("[ttt %s] out-of-turn move by %s (expected %s)\n", key, g.player, st.Next)
		return nil
	}

	// Vacancy check
	if st.Board[row][col] != '_' {
		fmt.Printf("[ttt %s] cell already taken at [%d,%d] (by %c)\n", key, row, col, st.Board[row][col])
		return nil
	}

	// Apply move
	sym := symbolFor(st, g.player) // 'X' or 'O'
	st.Board[row][col] = sym

	// Compute winner/draw and set next
	if isWin(st.Board, sym) {
		st.Winner = g.player
		st.Next = ""
		fmt.Printf("[ttt %s] %s (%c) wins\n", key, g.player, sym)
	} else if isFull(st.Board) {
		st.Winner = "-"
		st.Next = ""
		fmt.Printf("[ttt %s] draw\n", key)
	} else {
		// flip turn
		if sym == 'X' {
			st.Next = st.O
		} else {
			st.Next = st.X
		}
	}
	return nil
}

/** ==============================  */
// --- helpers ---
/** ==============================  */

func matchKey(g game_data) string {
	if v, ok := g.payload["matchId"]; ok {
		if s, ok := v.(string); ok && s != "" {
			return "ttt:" + s
		}
	}
	return "ttt:global"
}

func parsePos(v any) (int, int, bool) {
	arr, ok := v.([]any)
	if !ok || len(arr) != 2 {
		return 0, 0, false
	}
	rf, okR := arr[0].(float64)
	cf, okC := arr[1].(float64)
	if !okR || !okC {
		return 0, 0, false
	}
	return int(rf), int(cf), true
}

func assignSeats(st *tttState, user string) {
	if st.X == "" {
		st.X = user
		st.Next = st.X // X starts
		return
	}
	if st.X != "" && st.O == "" && st.X != user {
		st.O = user
	}
}

func symbolFor(st *tttState, user string) rune {
	if user == st.X {
		return 'X'
	}
	return 'O'
}

func isFull(b [3][3]rune) bool {
	for r := 0; r < 3; r++ {
		for c := 0; c < 3; c++ {
			if b[r][c] == '_' {
				return false
			}
		}
	}
	return true
}

func isWin(b [3][3]rune, s rune) bool {
	lines := [8][3][2]int{
		{{0, 0}, {0, 1}, {0, 2}},
		{{1, 0}, {1, 1}, {1, 2}},
		{{2, 0}, {2, 1}, {2, 2}},
		{{0, 0}, {1, 0}, {2, 0}},
		{{0, 1}, {1, 1}, {2, 1}},
		{{0, 2}, {1, 2}, {2, 2}},
		{{0, 0}, {1, 1}, {2, 2}},
		{{0, 2}, {1, 1}, {2, 0}},
	}
	for _, ln := range lines {
		if b[ln[0][0]][ln[0][1]] == s &&
			b[ln[1][0]][ln[1][1]] == s &&
			b[ln[2][0]][ln[2][1]] == s {
			return true
		}
	}
	return false
}
