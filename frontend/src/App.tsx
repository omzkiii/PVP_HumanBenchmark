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


async function CheckForAuth(): Promise<boolean> {
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
  const [isValidationState, setisValidationState] = useState<boolean | null>(null);

  // Sign Up Logic
  
  const [isSignupOpen, setIsSignupOpen] = useState(false); // Shared Modal State
 
  const toggleSignupModal = (state: boolean) => {
    setIsSignupOpen(state);
  };

  // 


  //Check Connection

  const CheckConnection = () => {
    console.log(isConnected);
  }

  //

  //Sign Out Logic // Expiration 

  const onSignoutFunction = async () => {
    try {
      console.log("pressed Signout")
      const res = await axios.post(
        url + "/logout", 
        {},
        { withCredentials: true }
      );

      if (res.data == "logged out") {
        setisValidationState(false);
      }


    } catch (e : unknown) {
      console.log(e)
    }

    return;
  }



  // maybe edit this in api instance
  useEffect(() => {
    let mounted = true;
  
    const checkConnection = async () => {
      try {
        const response = await axios.get(`${url}/health`);
        if (!mounted) return;
        setMessage(response.data);
        setConnectionState(true);
      } catch (err) {
        if (!mounted) return;
        setMessage("Failed to connect to backend " + err);
        setConnectionState(false);
      }
  
      // Auth check (must include credentials so cookie is sent)
      try {
        const userRes = await axios.get(url + "/me", { withCredentials: true });
        if (!mounted) return;
        console.log("User validated:", userRes.data);
        setisValidationState(true);
      } catch (e) {
        if (!mounted) return;
        console.log("Auth failed:", e);
        setisValidationState(false);
      }
    };
  
    checkConnection();
  
    return () => {
      mounted = false;
    };
  }, []); // run once on mount
  

  return (
    <>
      <Navigation 
      isValidated={isValidationState} 
      onAuthChange={setisValidationState}
      // ================
      isSignupOpen={isSignupOpen}
      onSignupToggle={toggleSignupModal}
      // ================
      onSignoutToggle={onSignoutFunction}
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
