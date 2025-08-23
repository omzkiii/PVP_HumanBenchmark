package games

import "fmt"

func tictactoe(g game_data) {
	// TODO: tictactoe logic
	fmt.Println("------TicTacToe-------")
	raw := g.payload["pos"].([]any)
	pos := make([]int, len(raw))
	for i, v := range raw {
		pos[i] = int(v.(float64))
	}
	fmt.Println(g.player, g.action, pos)
	fmt.Println("---------------------")
}
