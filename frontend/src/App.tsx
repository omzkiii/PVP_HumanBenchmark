import { useState } from "react";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;
import "./App.css";

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
function App() {
  const [message, setMessage] = useState("Hello World");

  return (
    <>
      {message}
      <button
        onClick={async () => {
          const data: string = await fetchMessage();
          setMessage(data);
        }}
      >
        {" "}
        Button
      </button>
    </>
  );
}

export default App;
