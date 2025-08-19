import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Queue.css";

// Note Should Have a Validity CHecker

const url = import.meta.env.VITE_API_BASE_URL;

export default function QueuePage() {
  const params = useParams(); // For handeling queue ticket id
  const navigate = useNavigate();
  const socket: any = useRef(null);

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
          id?: string;
        };

        if (msg.action === "switch" && msg.url) {
          console.log(`Switching to new socket: ${msg.url}`);
          socket.current.close();
          connect(msg.url);
          navigate(`/match/${msg.id}`);
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

  // Handles Web Socket Coonnection
  useEffect(() => {
    connect(`ws://localhost:3000/room`);
  }, []); // Empty makes it run once

  return (
    <>
      <div className="QueuePage">
        <h1>
          <span> L </span> <span> O </span> <span> O </span> <span> K </span>{" "}
          <span> I </span>
          <span> N </span> <span> G </span>
          <span className="space-mid-left"> F </span> <span> O </span>{" "}
          <span className="space-mid-right"> R </span>
          <span> P </span> <span> L </span> <span> A </span> <span> Y </span>{" "}
          <span> E </span>
          <span> R </span> <span> S </span>
        </h1>
        <button> Leave Queue </button>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>

            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
        <div className="Wave">
          <ul>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
            <li> </li>
          </ul>
        </div>
      </div>
    </>
  );
}
