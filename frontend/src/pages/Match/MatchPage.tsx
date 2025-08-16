import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const url = import.meta.env.VITE_API_BASE_URL;

export default function MatchPage() {
  const params = useParams(); // For handeling queue ticket id

  const socket: any = useRef(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.current = new WebSocket(`ws://localhost:3000/room`); // Connect to a room websocket

    // Set up event listeners
    socket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.current.onmessage = (event: any) => {
      console.log("Message from server:", event.data);
    };

    socket.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup on component unmount
    /*return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };*/
  }, []); // Empty makes it run once

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message);
      setMessage("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // updates message state
        />
        <input type="submit" value="Send" />
      </form>
    </>
  );
}

