import { useEffect, useState } from "react";
import "../css/main.css";

export default function LandingPageContent() {
    return (
        <>
        <div className="LandingPage">
            <div>
                <img className="crown" src="/images/crown.svg" alt="Logo" />
                <h1 className="noise-text"> BENCHMARK </h1>
                <div className="battles-container">
                    <div className="battle-square left-square"></div>
                    <h1 className="battles-yellow">BATTLES</h1>
                    <div className="battle-square right-square"></div>
                </div>
            </div>
            <div> 
                <button id="MM-btn"> LOOK FOR A MATCH </button>
                <p> CHALLENGE OTHERS FOR THE TITLE OF ULTIMATE HUMAN </p>
            </div>
            
        </div>
        <div className="Footer"> a</div>
        </>
    ) 
    

}