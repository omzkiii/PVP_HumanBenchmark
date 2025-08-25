import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  type RefObject,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import "./MatchPage.css";
import RPS from "../../components/Games/RPS";
import TicTacToe from "../../components/Games/TicTacToe";

/** GAME CONTEXT CAN EXPAND IF NEEDED */

type GameId = "ttt" | "rps";
type GameEntry = { Comp: React.ComponentType<any>; label: string };

const GAMES: Record<GameId, GameEntry> = {
  ttt: { Comp: TicTacToe, label: "Tic-Tac-Toe" },
  rps: { Comp: RPS, label: "Rock–Paper–Scissors" },
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface GameProponents {
  connected?: boolean;
  actionFunction?: (type: string, payload: Json, game: string) => void;
  seqRef?: RefObject<number>;
  seats: string[] | undefined;
  curPlayer: string | undefined;
  myTurn?: boolean;
  lastMessage?: any;
  me?: string | null;
}

export const MatchContext = createContext<GameProponents | undefined>(
  undefined,
); // Can exapnd to parent queue for better check

/** GAME CONTEXT CAN EXPAND IF NEEDED */

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const [rps, setRps] = useState<{ picks: Record<string, string | null> }>({
    picks: {},
  });

  /** ==============================  */
  //* Connection Logic Variables */
  /** ==============================  */

  const matchSocket = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false); // UseContext
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState<any>(null);

  /** ==============================  */

  /** ==============================  */
  //* Games Variables*/
  /** ==============================  */

  const [gameData, setGameData] = useState(null);
  /** ==============================  */

  /** ==============================  */
  //* Order Logic Variables*/
  /** ==============================  */

  const [me, setMe] = useState<string | null>(null);
  const [seats, setSeats] = useState<string[] | undefined>(undefined);
  const [curPlayer, setCurPlayer] = useState<string | undefined>(undefined);
  const [myTurn, setMyTurn] = useState(false);

  const seqRef = useRef(0); // Current Sequence
  const didInitOrderRef = useRef(false);
  const seatsRef = useRef<string[]>([]);

  useEffect(() => {
    seatsRef.current = seats ?? [];
  }, [seats]);

  /** ==============================  */
  /** ==============================  */

  // Keep myTurn in sync with me/curPlayer
  // First use Effect (Separated for visuals)
  useEffect(() => {
    setMyTurn(Boolean(me && curPlayer && me === curPlayer));
  }, [me, curPlayer]);

  /** ==============================  */
  /** ==============================  */

  function handlePlayerOrder(playerOrder: string[]) {
    if (!Array.isArray(playerOrder) || playerOrder.length === 0) return;
    setSeats(playerOrder);

    if (seqRef.current < 1) {
      // init player order
      const first = playerOrder[0];

      if (!didInitOrderRef.current) {
        didInitOrderRef.current = true;
        setCurPlayer(first);
      } else setMyTurn(false);
    } else {
      // extra logic here
      // Once action has been sent properly switch for multople games
    }
  }

  // Connect to the room WebSocket and wire up handlers.
  function connect(wsUrl: string) {
    const ws = new WebSocket(wsUrl);
    matchSocket.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log(`Connected to ${wsUrl}`);
    };

    ws.onmessage = (event: MessageEvent) => {
      // Try to parse JSON; if not JSON, keep the raw string
      try {
        const parsed = JSON.parse(event.data);
        console.log(parsed);

        if (parsed.type == "you" && typeof parsed.userId == "string") {
          setMe(parsed.userId);
          return;
        }

        if (parsed.type == "Player Order" && parsed.seats != null) {
          handlePlayerOrder(parsed.seats as string[]);
          return;
        }

        // Could Convert this to a helper function?
        if (parsed.type == "action") {
          const from: string = parsed.from;

          // use the ref so we always have the latest seats
          const [a, b] = seatsRef.current;
          if (a && b) {
            setCurPlayer(from === a ? b : a);
          }

          // game-specific logic
          if (parsed.game === "rps") {
          }
          if (parsed.game === "ttt") {
            setGameData(parsed.payload);
          }
        }
        //

        setLastMessage(parsed);
        console.log("Message:", parsed);
      } catch {
        setLastMessage({ type: "raw", data: String(event.data) });
        console.log("Message (raw):", event.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log(`Disconnected from ${wsUrl}`);
    };

    ws.onerror = (event: Event) => {
      console.error("Socket error:", event);
    };

    return ws;
  }

  /** ==============================  */
  /** ==============================  */

  // Open the room socket on mount (and when :id changes); clean up on unmount.
  useEffect(() => {
    if (!id) return;

    const ws = connect(`ws://localhost:3000/room/${id}`);
    matchSocket.current = ws;

    return () => {
      try {
        ws.close();
      } finally {
        matchSocket.current = null;
        setConnected(false);
      }
    };
  }, [id]);

  /** ==============================  */
  /** ==============================  */

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const ws = matchSocket.current;
    if (ws && ws.readyState === WebSocket.OPEN && message.trim()) {
      // Send plain text
      ws.send(message.trim());
      setMessage("");
    }
  };

  /** ==============================  */
  /** ==============================  */

  const actionFunction = (action: string, payload?: any, game?: string) => {
    // Create function for determinig action:
    const ws = matchSocket.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log("Issue Connecting to websocket");
      return;
    }
    ws.send(
      JSON.stringify({
        type: "action",
        action,
        payload,
        game,
        seq: ++seqRef.current,
      }),
    ); // send to websocket
  };
  /** ==============================  */
  /** ==============================  */

  // Memoize context value to avoid rerenders (nOTE: jUST EDIT IF IT DOESNT WORK)
  const ctxValue = useMemo(
    () => ({
      connected,
      actionFunction,
      seqRef,
      seats,
      curPlayer,
      myTurn,
      lastMessage,
      me,
    }),
    [connected, actionFunction, seats, curPlayer, myTurn, lastMessage, me],
  );

  // Quick Game Switch Handler
  const [currentGame, setCurrentGame] = useState<GameId>("ttt");
  const curGame = GAMES[currentGame];

  // {curGame ? (
  //   <curGame.Comp key={currentGame} data={gameData} />
  // ) : (
  //   <div>Select a game</div>
  // )}
  return (
    <>
      <div className="MatchPage">
        <div className="MatchPage-Main">
          <div id="Game">
            <MatchContext.Provider value={ctxValue}>
              <TicTacToe data={gameData} />
            </MatchContext.Provider>
          </div>
          <div className=""></div>
        </div>

        <div className="MatchPage-SideBar">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={connected ? "Type and hit Enter…" : "Connecting…"}
            />
            <input type="submit" value="Send" disabled={!connected} />
          </form>
          <pre
            style={{
              marginTop: 12,
              padding: 8,
              background: "#f7f7f7",
              borderRadius: 6,
            }}
          >
            {JSON.stringify({ connected, lastMessage }, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
