import { useState } from "react";
import "../css/main.css";
import "../css/popup.css";
import { Link } from 'react-router-dom';
import LoginModal from "./Form Components/LoginModal";
import SignupModal from "./Form Components/SignupModal";

interface NavigationProps {
    isValidated: boolean;
    onAuthChange?: (v: boolean) => void;
    isSignupOpen?: boolean;
    onSignupToggle?: (state: boolean) => void;
}

export default function Navigation({ 
    isValidated, 
    onAuthChange, 
    isSignupOpen, 
    onSignupToggle 
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
                    <li><Link to="/profile/test">PROFILE</Link></li>
                    <li className="title"><a href="/">BB<span>LE</span></a></li>

                    {!isValidated && (
                        <>
                            <li onClick={() => onSignupToggle?.(true)}>SIGN UP</li>
                            <li onClick={() => setIsLoginOpen(true)}>LOG IN</li>
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