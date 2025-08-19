import { useContext, useState } from "react";
import "../css/main.css";
import "../css/popup.css";
import { Link } from "react-router-dom";
import LoginModal from "./Form Components/LoginModal";
import SignupModal from "./Form Components/SignupModal";
import { IsAuthorized } from "../API/AuthHelper";

interface NavigationProps {
  isSignupOpen?: boolean;
  onSignupToggle?: (state: boolean) => void;
  onSignoutToggle?: () => void;
}

export default function Navigation({
  isSignupOpen,
  onSignupToggle,
  onSignoutToggle,
}: NavigationProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const auth = useContext(IsAuthorized); //GLOBAL AUTH STATE
  if (!auth) throw new Error("IsAuthorized must be used within AuthHelper");
  const [isAuthorized, setIsAuthorized] = auth;

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleSignupClose = () => {
    onSignupToggle?.(false);
  };

  console.log("Navigation render — isAuthorized:", isAuthorized);

  return (
    <>
      <div className="Nav">
        <ul>
          <li>
            <Link to="/battles">BATTLES</Link>
          </li>
          <li className="title">
            <a href="/">
              BB<span>LE</span>
            </a>
          </li>

          {isAuthorized === null ? (
            <></>
          ) : isAuthorized === false ? (
            <>
              <li onClick={() => onSignupToggle?.(true)}>SIGN UP</li>
              <li onClick={() => setIsLoginOpen(true)}>LOG IN</li>
            </>
          ) : (
            <>
              <li onClick={() => onSignoutToggle?.()}>SIGN OUT</li>
              <li>
                <Link to="/profile/test">PROFILE</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {isLoginOpen && (
        <LoginModal
          onLoginSuccess={() => {
            setIsLoginOpen(false);
          }}
          onClose={handleLoginClose}
        />
      )}

      {isSignupOpen && <SignupModal onClose={handleSignupClose} />}
    </>
  );
}
