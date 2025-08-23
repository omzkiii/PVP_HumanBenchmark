import { useState } from "react";
import "./TicTacToe.css";
function TicTacToe() {
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

  return (
    <>
      <div id="ttt">
        <div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div id={`row${rowIndex + 1}`} key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <button key={colIndex} onClick={() => move(rowIndex, colIndex)}>
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
