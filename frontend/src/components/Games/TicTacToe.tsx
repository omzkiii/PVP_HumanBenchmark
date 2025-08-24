import { useContext, useRef, useState } from "react";
import "./TicTacToe.css";
import { Game } from "../../pages/Test";
import { MatchContext } from "../../pages/Match/MatchPage";


function TicTacToe() {
  const matchSocket = useContext(Game);

  const mtchCtx = useContext(MatchContext)

  if (!mtchCtx) return null;
  const { connected, actionFunction, seqRef, curPlayer, myTurn } = mtchCtx;
  console.log(
    "curPlayer: " + curPlayer +
    "connected: " + connected +
    "seqRef: " + seqRef +
    "myTurn: " + myTurn 
  );


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
      <div id="TTT">
        <div className="holder">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div id={`row${rowIndex + 1}`} key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <button
                  disabled={!myTurn}
                  key={colIndex}
                  onClick={() =>
                    actionFunction?.("move", { pos: [rowIndex, colIndex] }, "ttt")
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
