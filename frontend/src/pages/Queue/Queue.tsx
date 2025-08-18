import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Queue.css";

// Note Should Have a Validity CHecker 


const url = import.meta.env.VITE_API_BASE_URL;

export default function QueuePage() {
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

  // Handles Web Socket Coonnection
  useEffect(() => {
    connect(`ws://localhost:3000/room`);
  }, []); // Empty makes it run once


  return (
    <>
      <div className="QueuePage">
   
        <h1> <span> L </span> <span> O </span> <span> A </span> <span> D </span> <span> I </span><span> N </span> <span> G </span>  </h1>
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
