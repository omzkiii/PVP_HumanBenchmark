import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./Queue.css";

// Note Should Have a Validity CHecker

const url = import.meta.env.VITE_API_BASE_URL;

export default function QueuePage() {
  const navigate = useNavigate();
  const params = useParams(); // For handeling queue ticket id

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
          path?: string;
        };

        if (msg.action === "switch" && msg.url && msg.path) {
          //Need to add a confirmation somewhere here
          console.log(`Switching to new socket: ${msg.url}`);
          socket.current.close();
          connect(msg.url);
          setTimeout(() => {
            navigate(`${msg.path}`, { state: msg.url });
          }, 3000);
        } else if (msg.action === "duplicate") {
          alert("Already Queued");
          navigate("/");
        } else console.log("Message:", msg);
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
    // Check if valid, then do a connect forms passing data to room.go

    //connect(`ws://localhost:3000/room`);
    connect(`ws://localhost:3000/matchmaking`);
    return () => {
      socket.current.close();
      console.log("Stopped Queueing");
    };
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
        <button
          onClick={() => {
            socket.current?.close();
            navigate("/");
          }}
        >
          {" "}
          Leave Queue{" "}
        </button>
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
