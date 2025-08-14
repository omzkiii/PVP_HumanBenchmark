import { useEffect, useState } from "react";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;
import "./App.css";
import Signup from "./components/Signup";

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
    <div className="MotherofGod-Container">


      <section className="Landing-Area">
        <header className="navbar">
          <nav>
            <a href="#">BATTLES</a>
            <a href="#">PROFILE</a>
          </nav>
          <div className="auth-buttons">
            <button className="sign-up">SIGN UP</button>
            <button className="log-in">LOG IN</button>
          </div>
        </header>

        <div className="Landing-Content-Container">
          <h1 className="Main-Title">
            <span className="title-dark">BENCHMARK</span>
            <br />
            <span className="title-yellow">BATTLES</span>
          </h1>
          <button className="lookformatch-button">LOOK FOR A MATCH</button>
          <p className="subtitle">
            CHALLENGE OTHERS FOR THE TITLE OF ULTIMATE HUMAN
          </p>
        </div>



      </section>
      
      <section className="pre-existing-section">
      <div className="status-check">
        {message}
          <div>
            <p>
              {" "}
              Go Server Status {isConnected ? "Connected" : "Connection Failed"}
            </p>
          </div>
        {message}
        <button
          onClick={async () => {
            const data: string = await fetchMessage();
            setMessage(data);
            }}>
          {" "}
          Button
        </button>
        <Signup />



      </div>
    </section>

    </div>
  );
}

export default App;
