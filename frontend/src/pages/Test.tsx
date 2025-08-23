import { createContext, useEffect, useRef, useState } from "react";
import TicTacToe from "../components/Games/TicTacToe";
import { useParams } from "react-router-dom";

export const Game = createContext<any | null>(null);

function Test() {
  const { id } = useParams<{ id: string }>();
  const [me, setMe] = useState<string | null>(null);
  const matchSocket = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState<any>(null);

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

        if (parsed.type == "you" && typeof parsed.userId == "string") {
          setMe(parsed.userId);
          return;
        }

        if (parsed.type == "action" && parsed.game == "ttt") {
          return;
        }

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

  const seqRef = useRef(0); // Current Sequence
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
  }, [id, me]);

  return (
    <div>
      <Game value={matchSocket}>
        <TicTacToe />
      </Game>
    </div>
  );
}

export default Test;
