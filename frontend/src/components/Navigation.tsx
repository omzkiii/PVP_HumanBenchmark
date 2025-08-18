import { useState } from "react";
import "../css/main.css";
import "../css/popup.css";
import { Link } from 'react-router-dom';
import LoginModal from "./Form Components/LoginModal";
import SignupModal from "./Form Components/SignupModal";

interface NavigationProps {
    isValidated: boolean | null;
    onAuthChange?: (v: boolean) => void;
    isSignupOpen?: boolean;
    onSignupToggle?: (state: boolean) => void;
    onSignoutToggle?: () => void;
}

export default function Navigation({ 
    isValidated, 
    onAuthChange, 
    isSignupOpen, 
    onSignupToggle,
    onSignoutToggle
}: NavigationProps) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleLoginClose = () => {
        setIsLoginOpen(false);
    };

    const handleSignupClose = () => { 
        onSignupToggle?.(false);
    };

   


    return (
        <>
            <div className="Nav">
                <ul>
                    <li><Link to="/battles">BATTLES</Link></li>
                    <li className="title"><a href="/">BB<span>LE</span></a></li>

                    {isValidated === null ? (
                    <>
                        
                    </>
                    ) : isValidated === false ? (
                    <>
                        <li onClick={() => onSignupToggle?.(true)}>SIGN UP</li>
                        <li onClick={() => setIsLoginOpen(true)}>LOG IN</li>
                    </>
                    ) : (
                    <>
                        <li onClick={() => onSignoutToggle?.()}>SIGN OUT</li>
                        <li><Link to="/profile/test">PROFILE</Link></li>
                    </>
                    )}
                </ul>
            </div>

            {isLoginOpen && (
                <LoginModal 
                    onLoginSuccess={() => {
                        onAuthChange?.(true);
                        setIsLoginOpen(false);
                    }} 
                    onClose={handleLoginClose}  
                />
            )}
            
            {isSignupOpen && (
                <SignupModal 
                    onClose={handleSignupClose}
                />
            )}
        </>
    );
}