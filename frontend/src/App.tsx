import { useEffect, useState } from "react";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;
import "./App.css";
import Signup from "./components/Form Components/Signup";
import Navigation from "./components/Navigation";
import LandingPageContent from "./components/LandingContent";
import { Link } from "react-router-dom";

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

const BACKEND_URL: string = "http://localhost:3000/";

function App() {
  const [message, setMessage] = useState("Loading.....");
  const [isConnected, setConnectionState] = useState(false);

  //Check Connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/health`);

        setMessage(response.data);
        setConnectionState(true);
      } catch (err) {
        setMessage("Failed to connect to backend " + err);
        setConnectionState(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <>
      <Navigation />
      <LandingPageContent />
    </>
  );
}

export default App;
