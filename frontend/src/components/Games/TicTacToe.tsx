import { useContext, useEffect, useRef, useState } from "react";
import "./TicTacToe.css";
import { Game } from "../../pages/Test";
import { MatchContext } from "../../pages/Match/MatchPage";


function TicTacToe() {
  const matchSocket = useContext(Game);
  const mtchCtx = useContext(MatchContext)

  if (!mtchCtx) return null;
  const { actionFunction, myTurn, lastMessage, me, seats } = mtchCtx;

  const rows = 3;
  const cols = 3;
  const [gameData, setGameData] = useState<string[][]>([
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ]);


  // decide symbols based on seat order: seats[0] => "X", seats[1] => "O"
  const mySymbol = (() => {
    if (!me || !seats) return "X";
    return seats[0] === me ? "X" : "O";
  })();

  const oppSymbol = mySymbol === "X" ? "O" : "X";



  // Apply opponent moves from the room broadcast
  useEffect(() => {
    if (!lastMessage || lastMessage.type !== "action" || lastMessage.game !== "ttt") return;
    const { from, action, payload } = lastMessage as {
      from: string; action: string; payload: { pos: [number, number] }
    };
    if (action !== "move") return;
    const [r, c] = payload.pos;
    setGameData(prev => {
      if (!Array.isArray(prev?.[r])) return prev;
      // if cell is empty, fill with opp symbol (or from's seat mapping if you prefer)
      if (prev[r][c] !== "_") return prev;
      const next = prev.map(row => row.slice());
      next[r][c] = (from === me) ? mySymbol : oppSymbol;
      return next;
    });
  }, [lastMessage, me, mySymbol, oppSymbol]);


  // Send move + mark locally for snappy UI
  function onCellClick(r: number, c: number) {
    if (!myTurn || gameData[r][c] !== "_") return;

    setGameData(prev => {
      const next = prev.map(row => row.slice());
      next[r][c] = mySymbol;
      return next;
    });

    actionFunction?.("move", { pos: [r, c] }, "ttt");
  }

  
  return (
    <>
      <div id="TTT">
        <div className="holder">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div id={`row${rowIndex + 1}`} key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <button
                  key={colIndex}
                  disabled={!myTurn || gameData[rowIndex][colIndex] !== "_"}
                  onClick={() =>
                    onCellClick(rowIndex, colIndex)
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
