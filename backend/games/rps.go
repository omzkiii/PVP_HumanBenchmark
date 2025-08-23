package games

import "fmt"

func rps(g game_data) {
	fmt.Println("-------RPS-----------")
	fmt.Println(g.player, g.action, g.payload["choice"])
	fmt.Println("---------------------")

	// TODO: rps logic
}
