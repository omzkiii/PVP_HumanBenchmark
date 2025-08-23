import { useContext, useRef, useState } from "react";
import "./TicTacToe.css";
import { Game } from "../../pages/Test";
function TicTacToe() {
  const matchSocket = useContext(Game);
  const rows = 3;
  const cols = 3;
  const ttt_data: string[][] = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];
  const [gameData, setGamedata] = useState(ttt_data);
  function move(x: number, y: number) {
    const data = [...gameData];
    data[x][y] = "X";
    setGamedata(data);
  }

  const seqRef = useRef(0); // Current Sequence
  const actionFunction = (action: string, payload?: any, game?: string) => {
    // Create function for determinig action:
    const ws = matchSocket.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log(ws === true);
      console.log("Issue Connecting to websocket");
      return;
    }
    ws.send(
      JSON.stringify({
        type: "action",
        action,
        payload,
        game,
        seq: ++seqRef.current,
      }),
    ); // send to websocket
  };

  return (
    <>
      <div id="ttt">
        <div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div id={`row${rowIndex + 1}`} key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() =>
                    actionFunction("move", { pos: [rowIndex, colIndex] }, "ttt")
                  }
                >
                  {gameData[rowIndex][colIndex]}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TicTacToe;
