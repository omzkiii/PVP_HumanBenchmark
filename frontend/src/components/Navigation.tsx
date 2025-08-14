import { useEffect, useState, useContext } from "react";
import "../css/main.css";
import {Link, useLocation } from 'react-router-dom'; // Not 'react-router'
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";



export default function Navigation() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    function handleRegState(type: string, state : boolean) {
        if (type != null) {
            if (type == "LG") { setIsLoginOpen(state); }
            else if (type == "SG") { setIsSignupOpen(state);}
            else return;
        } else return;
    }
    

    return (
        <>
            <div className="Nav">
                <ul>
                    <li> <Link to="/battles"> BATTLES </Link> </li>
                    <li> <Link to="/profile/test"> PROFILE </Link> </li>
                    <li className="title"> <a href="/"> BB<span>LE</span> </a></li>
                    <li onClick={() => setIsSignupOpen(true)}>SIGN UP</li>
                    <li onClick={() => setIsLoginOpen(true)}>LOG IN</li>
                </ul>
            </div>

            {isLoginOpen && <LoginModal onClose={() => handleRegState("LG", false)} />}
            {isSignupOpen && <SignupModal onClose={() =>handleRegState("SG", false)} />}
        </>
    );

    

}