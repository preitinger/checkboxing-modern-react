import React from 'react'
import './App.css';
import Board from './components/Board'
import SidePanel from './components/SidePanel'
import Move from './Move'
import {mkBoard, gameOver} from './Board'
import {useState, useRef, useLayoutEffect, useEffect} from 'react'
import nextId from './nextId'
import produce from 'immer';
import checkedImg from './res/checked.png'
// import './utils/Checkbox.css'
import Root from './testRerendering/Root'
import Msg from './components/Msg'
import BotMove from './BotMove'
import Timer from './utils/Timer.tsx'
import './components/Board.css'
import Board2 from './components/Board2'

const makeSettings = () => ({
  game: {
    rowCount: 5,
    bots: [true, false],
    lastWins: true,
  },
  botMoves: [
    {
      animationMs: 500,
      priority: "random", // or "short" or "long"
    },
    {
      animationMs: 500,
      priority: "random", // or "short" or "long"
    },
  ]
})


// const makeSegment = (size) => {
//   return {
//     id: nextId(),
//     size: size,
//     checked: false,
//   }
// }
//
// const makeRow = (size) => {
//   return {
//     id: nextId(),
//     segments: [makeSegment(size)]
//   }
// }
//
// const makeBoard = (size) => {
//   const rows = []
//
//   for (let i = 0; i < size; ++i) {
//     rows.push(makeRow(i + 1))
//   }
//
//   return {
//     rows: rows
//   }
// }

function evtlStartBotMove(draft) {
  if (draft.settings.game.bots[draft.player]) {
    if (draft.botMove.rowIdx === -1) {
      console.log("board before BotMove.query: ", draft.board);
      const {move, willWin} = BotMove.query(draft.board, draft.settings.game.lastWins, draft.settings.botMoves[draft.player].priority);
      if (move == null) {
        console.error("move = null: Spielende noch nicht implementiert");
      } else {
        draft.botMove = move;
        console.log("draft.botMove was set to ", move);
      }
    }
  }
}


function doMoveAndContinue(draft, move) {
  if (move == null || move.rowIdx === -1) {
    console.error("move null or empty in doMoveAndContinue");
    return;
  }
  Move.doMove(draft.board, move);
  draft.player = 1 - draft.player;
  draft.botMove = Move.mkMove2();

  if (gameOver(draft.board)) {
    console.log("Game over!");
    draft.player = -1;
    return;
  }

  // wenn Spiel nicht zuende, naechsten Zug beginnen
  evtlStartBotMove(draft);
}

const App = () => {
  // // TODO begin test
  // return <Root/>
  // // TODO end test


  // console.log("settings", settings);
  const [state, setState] = useState(() => {
    const settings = makeSettings();
    const draft = {
      settings: settings,
      board: mkBoard(settings.game.rowCount),
      player: -1,
      botMove: Move.mkMove2(), // initially empty move
      onlyAllowedSegId: -1,
    }
    evtlStartBotMove(draft);
    return draft;
  });

  // Das Callback-Argument von useEffect wird genau einmal nach jedem render- oder re-render-
  // Vorgang aufgerufen.
  useEffect(() => {
    if (state.player === -1) return;

    if (state.settings.game.bots[state.player]) {
      if (state.botMove == null || state.botMove.rowIdx === -1) {
        console.error("botMove null or empty ");
        return;
      }

      const timer = setTimeout(() => {
        setState(s => produce(s, draft => {
          draft.singleShotActive = false;
          console.log("in Timer-Funktion: draft.botMove.rowIdx=", draft.botMove.rowIdx);
          doMoveAndContinue(draft, draft.botMove);
        }))

      }, state.settings.botMoves[state.player].animationMs);
      return () => {
        clearTimeout(timer);
      }
    }
  });



  const onSettingsUpdate = (tmpSettings) => {
    console.log("onSettingsUpdate: tmpSettings=", tmpSettings);

      setState(s => produce(s, draft => {
        draft.nextSettings = tmpSettings;

        if (draft.player === -1) {
          draft.settings = tmpSettings;
          draft.board = mkBoard(tmpSettings.game.rowCount);
        } else {
          draft.settings.botMoves = tmpSettings.botMoves;
        }
      }))
    }

  const updateOnlyAllowedSegId = (segId) => {
    setState(s => produce(s, (draft => {
      draft.onlyAllowedSegId = segId;
    })))
  }

  const doMove = rowIdx => segIdx => (first, last) => {
    // console.warn("in doMove", rowIdx, segIdx, first, last);
    setState(s => produce(s, draft => {
      doMoveAndContinue(draft, {
        rowIdx: rowIdx,
        segIdx: segIdx,
        first: first,
        last: last
      })
    }))
  }

  const onStart = () => {
    setState(s => produce(s, draft => {
      draft.settings = draft.nextSettings;
      draft.board = mkBoard(draft.settings.game.rowCount);
      draft.player = 0;
      draft.botMove = Move.mkMove2(); // initially empty move
      draft.onlyAllowedSegId = -1;
      evtlStartBotMove(draft);
    }))
  }

  const testRows2 = [];
  for (let i = 0; i < state.settings.game.rowCount; ++i) {
    const testBoxes = [];
    for (let j = 0; j < i + 1; ++j) {
      testBoxes.push(
        <div className="boxContainer2">
          <input type="checkbox" readOnly/>
        </div>
      );
    }
    testRows2.push(
      <div className="row2">
      {testBoxes}
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className="main">
        <header className="header">
          <h1>Checkboxing</h1>
        </header>
        <div className="left">
          <div className='boardParent'>
          <Board
          board={state.board}
          botMove={state.botMove}
          noneAllowed={state.player === -1 || state.settings.game.bots[state.player]}
          onlyAllowedSegId={state.onlyAllowedSegId}
          updateOnlyAllowedSegId={updateOnlyAllowedSegId}
          doMove={doMove}
          />
          </div>
          <div className="buttonRow">
          <button className="sideButton" onClick={onStart}>Spiel starten</button>
          </div>
        </div>
        <div className="right">
          <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
        </div>
        <footer className="footer">
          <a href="https://de.freepik.com/vektoren-kostenlos/haekchen-und-kreuzsymbole-in-flachen-stilen_18141266.htm#query=checkbox&position=0&from_view=keyword" target="_blank">Bild von starline</a> auf Freepik
          <img src={checkedImg} width='20px'/>
          <fieldset>
            <legend>Layout Test</legend>
            <div className="testBoard2">
            <div className="boardWrap2">
            <div className="board2">
              {testRows2}
            </div>
            </div>
            <div className='sidePanelContainer2'>
            <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
            </div>
            </div>
          </fieldset>
        </footer>
      </div>
    </React.StrictMode>
  );
}

export default App;
