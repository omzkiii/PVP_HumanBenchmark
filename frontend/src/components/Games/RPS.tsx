

import { useContext } from "react";
import { MatchContext } from "../../pages/Match/MatchPage";
import "./RPS.css";


export default function RPS () {

    const mtchCtx = useContext(MatchContext)

    if (!mtchCtx) return null;
    const {connected, actionFunction} = mtchCtx;

    return (
        <div id="RPS">
              <div className="gameView-container">
                <div id="player1-action">
                  <img src="/images/paper.png" alt="player 1 action"></img>
                </div>
                <div id="player2-action">
                  <img src="/images/rock.png" alt="player 1 action"></img>
                </div>
              </div>
              <div className="action-container">
                <div className="wrapper">
                  <button
                    disabled={!connected}
                    onClick={() => {
                      actionFunction?.("throw", { choice: "rock" }, "rps")
                    }}
                  >
                    {" "}
                    🪨{" "}
                  </button>
                  <button
                    disabled={!connected}
                    onClick={() => {
                      actionFunction?.("throw", { choice: "paper" }, "rps");
                    }}
                  >
                    {" "}
                    📄{" "}
                  </button>
                  <button
                    disabled={!connected}
                    onClick={() => {
                      actionFunction?.("throw", { choice: "scissors" }, "rps");
                    }}
                  >
                    {" "}
                    ✂️{" "}
                  </button>
                </div>
              </div>
            </div>
    )
}