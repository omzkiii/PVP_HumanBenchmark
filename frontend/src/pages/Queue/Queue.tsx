import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const url = import.meta.env.VITE_API_BASE_URL;

export default function QueuePage() {
  const params = useParams(); // For handeling queue ticket id

  const socket: any = useRef(null);

  const [message, setMessage] = useState("");
  

  //Connect to go lang websocket base
  function connect(url: string) {
    socket.current = new WebSocket(url);

    socket.current.onopen = () => {
      console.log(`Connected to ${url}`);
    };

    socket.current.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data) as {
          action: string;
          url?: string;
        };

        if (msg.action === "switch" && msg.url) {
          console.log(`Switching to new socket: ${msg.url}`);
          socket.current.close();
          connect(msg.url);
        } else {
          console.log("Message:", msg);
        }
      } catch (err) {
        console.log(event.data);
      }
    };

    socket.current.onclose = () => {
      console.log(`Disconnected from ${url}`);
    };

    socket.current.onerror = (err: Error) => {
      console.error("Socket error:", err);
    };
  }
  useEffect(() => {
    connect(`ws://localhost:3000/room`);
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
