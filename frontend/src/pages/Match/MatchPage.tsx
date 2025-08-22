import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./MatchPage.css";



export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const [me, setMe] = useState<string | null>(null);
  const [rps, setRps] = useState<{ picks: Record<string, string | null> }>({ picks: {} });

  const matchSocket = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState<any>(null);

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

        if (parsed.type == "you" && typeof parsed.userId == "string") {
          setMe(parsed.userId);
          return;
        }

        if (parsed.type == "action" && parsed.game == "rps") {
          const from = parsed.from as string // Check the userID
          const choice = parsed.payload?.choice ?? null;
          setRps(prev => ({ picks: { ...prev.picks, [from]: choice } }));
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

  // Open the room socket on mount (and when :id changes); clean up on unmount.
  useEffect(() => {
    if (!id) return;

    const ws = connect(`ws://localhost:3000/${id}`);
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

  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const ws = matchSocket.current;
    if (ws && ws.readyState === WebSocket.OPEN && message.trim()) {
      // Send plain text
      ws.send(message.trim());
      setMessage("");
    }
  };


  const seqRef = useRef(0); // Current Sequence
  const actionFunction = (action: string, payload?: any, game?: string) => {
    // Create function for determinig action:
    const ws = matchSocket.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log("Issue Connecting to websocket");
      return;
    }
    ws.send(JSON.stringify({type: "action", action, payload, game, seq: ++seqRef.current})) // send to websocket
  }



  return (
    <>
      <div className="MatchPage">
        <div className="MatchPage-Main"> 
          <div id="Game">
            
            {/* Rock, Paper, Scissors Game */}
            <div id="RPS">
              <div className="gameView-container">  
                <div id="player1-action"> 
                  <img src="/images/paper.png" alt="player 1 action" ></img>
                </div>
                <div id="player2-action">   
                <img src="/images/rock.png" alt="player 1 action"></img>
                </div>
              </div>
              <div className="action-container">
                <div className="wrapper">  
                  <button disabled={!connected} onClick={() => {actionFunction("throw", { choice: "rock" }, "rps");}}> 🪨 </button>
                  <button disabled={!connected} onClick={() => {actionFunction("throw", { choice: "paper" }, "rps");}}> 📄 </button>
                  <button  disabled={!connected} onClick={() => {actionFunction("throw", { choice: "scissors" }, "rps");}}> ✂️ </button>
                </div>
                
              </div>
            </div>
            

          </div>  
          <div className="">
          </div>

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
