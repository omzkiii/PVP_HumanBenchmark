package games

import "time"

type GameType string

const (
	GameTTT GameType = "ttt"
	GameRPS GameType = "rps"
	GameRFX GameType = "rfx"
	GameMRY GameType = "mry"
	GameCN3 GameType = "cn3"
)

type MatchPhase string

const (
	PhaseLobby MatchPhase = "lobby" // waiting / seeding
	PhaseDraft MatchPhase = "draft" // bans/picks
	PhaseStage MatchPhase = "stage" // playing current stage
	PhaseDone  MatchPhase = "done"  // match finished
)

type DraftState struct {
	Pool      []GameType
	Banned    []GameType
	Picks     []GameType
	Turn      string
	Step      int
	Script    []string
	TimerEnds time.Time
}


type SeriesStatus string
const (
	SeriesPlaying SeriesStatus = "Playing"
	SeriesComplete SeriesStatus = "complete"
)

type Series struct {
    Game     GameType
    Mode     string            // "bo3" (configure to bo1/bo5 as needed)
    Seats    [2]string
    Wins     map[string]int    // wins per player
    Needed   int               // 2 for bo3
    Index    int               // current game index (0-based)
    Current  any               // pointer to game-specific state (e.g. *TTTState, *RPSState)
    History  []any             // per-game results (game-specific)
    Status   SeriesStatus
    Winner   string           
    Seq      int
}

type Stage struct {
    Game   GameType
    Series *Series
}

type Match struct {
    RoomID     string
    Phase      MatchPhase
    Seats      [2]string // playerID ordering
    Draft      DraftState
    Stages     []Stage   // ordered after draft completes
    StageIdx   int       // which stage we are on
    Score      map[string]int // stage wins (e.g., first to K stages wins match)
    NeedStages int       // e.g., 3 if best-of-5 stages; or equal to len(Stages) if you play all
    Winner     string
}