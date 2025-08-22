import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const ws = matchSocket.current;
    if (ws && ws.readyState === WebSocket.OPEN && message.trim()) {
      // Send plain text
      ws.send(message.trim());
      setMessage("");
    }
  };

  return (
    <>
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
    </>
  );
}
