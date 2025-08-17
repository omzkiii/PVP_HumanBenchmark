import { useEffect, useState, useContext } from "react";
import "../css/main.css";
import "../css/popup.css"; //Handles Popup design
import {Link, useLocation } from 'react-router-dom'; // Not 'react-router'
import LoginModal from "./Form Components/LoginModal";
import SignupModal from "./Form Components/SignupModal";



interface NavigationProps {
    isValidated: boolean;
    onAuthChange?: (v: boolean) => void;
  }
  

export default function Navigation({ isValidated, onAuthChange}: NavigationProps) { // Change to object if you can
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    console.log(isValidated);

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

                    {
                        !isValidated ? (
                            <>
                                <li onClick={() => setIsSignupOpen(true)}>SIGN UP</li>
                                <li onClick={() => setIsLoginOpen(true)}>LOG IN</li>
                            </>
                        )
                        :
                        null
                    }
                    
                </ul>
            </div>

            {isLoginOpen && <LoginModal onLoginSuccess={() => onAuthChange?.(true)} onClose={() => handleRegState("LG", false)}  />}
            {isSignupOpen && <SignupModal onClose={() =>handleRegState("SG", false)} />}
        </>
    );

    

}