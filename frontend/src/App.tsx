import { useContext, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import "./App.css";
import Navigation from "./components/Navigation";
import LandingPageContent from "./components/LandingContent";
import { useNavigate } from "react-router-dom";
import { IsAuthorized } from "./API/AuthHelper";

const url = import.meta.env.VITE_API_BASE_URL;

function App() {
  const auth = useContext(IsAuthorized); //GLOBAL AUTH STATE
  if (!auth) throw new Error("IsAuthorized must be used within AuthHelper");
  const [isAuthorized, setIsAuthorized] = auth;

  // Sign Up Logic

  const [isSignupOpen, setIsSignupOpen] = useState(false); // Shared Modal State

  const toggleSignupModal = (state: boolean) => {
    setIsSignupOpen(state);
  };

  //Sign Out Logic // Expiration

  const onSignoutFunction = async () => {
    try {
      console.log("pressed Signout");
      const res = await axios.post(
        url + "/logout",
        {},
        { withCredentials: true },
      );

      if (res.status == HttpStatusCode.Ok) {
        setIsAuthorized(false);
      }
    } catch (e: unknown) {
      console.log(e);
    }

    return;
  };

  // Transition
  const [pageState, setPageState] = useState(false);
  const navigate = useNavigate();

  const handleTransition = (length: number) => {
    setPageState(true);

    const navigateTimer = setTimeout(() => {
      navigate("/matchmaking");
    }, length * 0.8);

    const hideTimer = setTimeout(() => {
      setPageState(false);
    }, length);

    return () => {
      clearTimeout(navigateTimer);
      clearTimeout(hideTimer);
    };
  };
  return (
    <>
      <div className={`transition ${pageState ? `transition-activate` : ``}`}>
        {" "}
      </div>
      <Navigation
        // ================
        isSignupOpen={isSignupOpen}
        onSignupToggle={toggleSignupModal}
        onSignoutToggle={onSignoutFunction}
      />
      <LandingPageContent
        onSignupToggle={toggleSignupModal}
        onTransitionHandle={handleTransition}
      />
    </>
  );
}

//need to pass state inbetween nav and land

export default App;
