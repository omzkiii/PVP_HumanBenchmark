import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Hello World");

  return (
    <>
      {message}
      <button
        onClick={() => {
          setMessage("Button Clicked!");
        }}
      >
        {" "}
        Button
      </button>
    </>
  );
}

export default App;
