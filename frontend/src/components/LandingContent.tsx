import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/main.css";



export default function LandingPageContent() {
    let navigate = useNavigate();
    const routeChange = (id: number) => {
        navigate(`/matches/${id}`);
    };

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
                <button id="MM-btn" onClick={() => routeChange(123)}> LOOK FOR A MATCH </button>
                <p> CHALLENGE OTHERS FOR THE TITLE OF ULTIMATE HUMAN </p>
            </div>
            
        </div>
        <div className="Footer"> a</div>
        </>
    ) 
    

}