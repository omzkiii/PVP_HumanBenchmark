import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Signup from "./components/Form Components/Signup";
import Navigation from "./components/Navigation";
import LandingPageContent from "./components/LandingContent";
import { Link } from "react-router-dom";


const url = import.meta.env.VITE_API_BASE_URL;

function fetchMessage(): Promise<string> {
  return axios
    .get<string>(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return `Error ${err}`;
    });
}


async function CheckForAuth() {
  try {

    const userRes = await axios.get(url + "/me", {
      withCredentials: true,
    })
    console.log("User Validated: ", userRes.data);
    
    return true
    
  } catch(e : unknown) {
    console.log("Failed", e);

    return false // Should have a popup checker or something
  }
}

function App() {
  const [message, setMessage] = useState("Loading.....");
  const [isConnected, setConnectionState] = useState(false);
  const [isValidationState, setisValidationState] = useState(false);

  // Sign Up Logic
  
  const [isSignupOpen, setIsSignupOpen] = useState(false); // Shared Modal State
 
  const toggleSignupModal = (state: boolean) => {
    setIsSignupOpen(state);
  };

  // 


  //Check Connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get(`${url}/health`);
        setMessage(response.data);
        setConnectionState(true);

        setisValidationState(await CheckForAuth());
        console.log("Setting validation state to:", isValidationState);

      } catch (err) {
        setMessage("Failed to connect to backend " + err);
        setConnectionState(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <>
      <Navigation 
      isValidated={isValidationState} 
      onAuthChange={setisValidationState} 
      isSignupOpen={isSignupOpen}
      onSignupToggle={toggleSignupModal}
      />
      <LandingPageContent
        isAuthenticated={isValidationState}
        onSignupToggle={toggleSignupModal}
      />
    </>
  );
}

//need to pass state inbetween nav and land

export default App;
