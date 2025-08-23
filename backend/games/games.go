package games

import (
	"encoding/json"
	"fmt"
	"time"
)

type message struct {
	Type    string         `json:"type"`
	From    string         `json:"from"`
	Action  string         `json:"action"`
	Payload map[string]any `json:"payload"`
	Game    string         `json:"game"`
	Seq     int            `json:"seq"`
	Ts      time.Time      `json:"ts"`
}

type game_data struct {
	player  string
	action  string
	seq     int
	payload map[string]any
	ts      time.Time
}

func Handle(msg []byte) {
	data := message{}
	if err := json.Unmarshal(msg, &data); err != nil {
		fmt.Println("Game unmarshall error: ", err)
		return
	}

	if data.Type != "action" {
		return
	}

	g := game_data{
		player:  data.From,
		action:  data.Action,
		seq:     data.Seq,
		payload: data.Payload,
		ts:      data.Ts,
	}

	switch data.Game {
	case "ttt":
		tictactoe(g)

	case "rps":
		rps(g)

	default:
		fmt.Println("unknown game")
	}
}
