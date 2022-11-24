import React from 'react'
import './App.css';
import Board from './components/Board'
import SidePanel from './components/SidePanel'
import Move from './Move'
import {mkBoard} from './Board'
import {useState, useRef, useEffect} from 'react'
import nextId from './nextId'
import produce from 'immer';
import checkedImg from './res/checked.png'
// import './utils/Checkbox.css'
import Root from './testRerendering/Root'
import Msg from './components/Msg'
import BotMove from './BotMove'
import Timer from './utils/Timer.tsx'

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
      priority: "long", // or "short" or "long"
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

const App = () => {
  // // TODO begin test
  // return <Root/>
  // // TODO end test


  const settings = makeSettings();
  // console.log("settings", settings);
  const [state, setState] = useState({
    settings: settings,
    board: mkBoard(settings.game.rowCount),
    player: 0, // TODO -1 und dann erst aendern?
    botMove: Move.mkMove2(), // initially empty move
    onlyAllowedSegId: -1,
  });
  useEffect(() => {

    if (state.settings.game.bots[state.player]) {
      if (state.botMove.rowIdx === -1) {
        setState(s => produce(s, draft => {
          console.log("board before BotMove.query: ", draft.board);
          const {move, willWin} = BotMove.query(draft.board, draft.settings.game.lastWins, draft.settings.botMoves[draft.player].priority);
          if (move == null) {
            console.error("move = null: Spielende noch nicht implementiert");
          } else {
            draft.botMove = move;
            console.log("draft.botMove was set to ", move);
          }
        }))
      } else {
        console.warn("vor singleShot");
        Timer.singleShot(state.settings.botMoves[state.player].animationMs).
        then(() => {
          console.log("then: ");
          setState(s => produce(s, draft => {
            console.log("draft.botMove: rowsIdx=", draft.botMove.rowIdx, draft.botMove.segIdx, draft.botMove.first, draft.botMove.last);
            Move.doMove(draft.board, draft.botMove);
            draft.player = 1 - draft.player;
            draft.botMove = Move.mkMove2();
          }))
        })
      }
    }

  })

  const onSettingsUpdate = (tmpSettings) => {
    console.log("onSettingsUpdate: tmpSettings=", tmpSettings);
  }

  const updateOnlyAllowedSegId = (segId) => {
    setState(s => produce(s, (draft => {
      draft.onlyAllowedSegId = segId;
    })))
  }

  const doMove = rowIdx => segIdx => async (first, last) => {
    console.log("in doMove", rowIdx, segIdx, first, last);
    setState(s => produce(s, draft => {
      Move.doMove(draft.board, {
        rowIdx: rowIdx,
        segIdx: segIdx,
        first: first,
        last: last
      })
      draft.player = 1 - draft.player;

    }))
  }

  return (
    <React.StrictMode>
        <div className="main">
          <header className="header">
            <h1>Checkboxing</h1>
          </header>
          <div className="left">
            <Board
            board={state.board}
            botMove={state.botMove}
            noneAllowed={state.settings.game.bots[state.player]}
            onlyAllowedSegId={state.onlyAllowedSegId}
            updateOnlyAllowedSegId={updateOnlyAllowedSegId}
            doMove={doMove}
            />
            <div className="buttonRow">
            <button className="sideButton">Spiel starten</button>
            </div>
          </div>
          <div className="right">
            <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
          </div>
          <footer className="footer">
            <a href="https://de.freepik.com/vektoren-kostenlos/haekchen-und-kreuzsymbole-in-flachen-stilen_18141266.htm#query=checkbox&position=0&from_view=keyword" target="_blank">Bild von starline</a> auf Freepik
            <img src={checkedImg} width='20px'/>
          </footer>
        </div>
    </React.StrictMode>
  );
}

export default App;
