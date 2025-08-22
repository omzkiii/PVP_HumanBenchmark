import { useContext } from "react";
import "../css/main.css";
import { IsAuthorized } from "../API/AuthHelper";

interface LandingProps {
  onSignupToggle: (state: boolean) => void;
  onTransitionHandle?: (length: number) => {};
}

export default function LandingPageContent({
  onSignupToggle,
  onTransitionHandle,
}: LandingProps) {
  const auth = useContext(IsAuthorized); //GLOBAL AUTH STATE
  if (!auth) throw new Error("IsAuthorized must be used within AuthHelper");
  const [isAuthorized, setIsAuthorized] = auth;

  const handleMatchClick = () => {
    if (!isAuthorized) {
      // Show signup modal if not authenticated
      onSignupToggle(true);
    } else {
      // Navigate to matches if authenticated
      onTransitionHandle?.(4000);
    }
  };

  return (
    <>
      <div className="LandingPage">
        <div className="LandingPage-Container">
          <img className="crown" src="/images/crown.svg" alt="Logo" />
          <h1 className="noise-text">BENCHMARK</h1>
          
          <div className="battles-container">
            <div className="battle-square left-square"></div>
            <h1 className="battles-yellow">BATTLES</h1>
            <div className="battle-square right-square"></div>
          </div>

        </div>
        <div>
          <button
            id="MM-btn"
            onClick={handleMatchClick}
            aria-label="Find a match"
          >
            LOOK FOR A MATCH
          </button>
          <p>CHALLENGE OTHERS FOR THE TITLE OF ULTIMATE HUMAN</p>
        </div>
      </div>
      <div className="Footer"></div>{" "}
    </>
  );
}

