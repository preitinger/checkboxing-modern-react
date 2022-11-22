import React from 'react'
import './App.css';
import Board from './components/Board'
import SidePanel from './components/SidePanel'
import Move from './Move'
import {mkBoard} from './Board'

import {useState, useRef} from 'react'

import nextId from './nextId'

import produce from 'immer';

import checkedImg from './res/checked.png'

import './utils/Checkbox.css'

const makeSettings = () => ({
  game: {
    rowCount: 5,
    bots: [false, true],
    lastWins: false,
  },
  botMoves: [
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

const App = () => {
  const settings = makeSettings();
  console.log("settings", settings);
  const [state, setState] = useState({
    settings: settings,
    board: mkBoard(settings.game.rowCount),
    player: 0, // TODO -1 und dann erst aendern?
    botMove: Move.mkMove2(), // initially empty move
    activeSegId: -1,
  });

  // const remRowInput = useRef(null);
  //
  // const addRow = () => {
  //   console.log("addRow");
  //   setState(produce(state, (draft) => {
  //     draft.board.rows.push(makeRow(5))
  //   }))
  // }
  //
  // const onRemNumberChange = (event) => {
  //   console.log("onRemNumberChange", event);
  //   setState(produce(state, (draft) => {
  //     draft.removeRow = event.target.value;
  //   }))
  // }

  // const removeRow = () => {
  //   setState(produce(state, draft => {
  //     const remRowIdx = remRowInput.current.value;
  //     draft.board.rows.splice(remRowIdx, 1)
  //   }))
  // }

  // const onSegmentClicked = rowId => segmentId => boxIdx => () => {
  //   console.log("onSegmentClicked", rowId, segmentId, boxIdx);
  // }

  const env = {
    state: state,

    updateActiveSegId: (segId) => {
      console.log("updateActiveSegId: segId=", segId);
      setState(state1 => produce(state1, draft => {
        draft.activeSegId = segId;
      }))
    },

    doMove: (rowIdx, segIdx, first, last) => {
      console.log('App.doMove: state.board');
      setState(state1 => produce(state1, draft => {
        console.log("innerhalb von doMove: activeSegId=", draft.activeSegId);
        Move.doMove(draft.board, Move.mkMove(rowIdx)(segIdx)(first)(last));
      }))
    }

  }

  console.log('vor return', state);

  // return (
  //   <React.StrictMode>
  //       <div className="main">
  //         <div className="left">
  //         </div>
  //         <div className="right">
  //         </div>
  //       </div>
  //   </React.StrictMode>
  // );
  return (
    <React.StrictMode>
        <div className="main">
          <header className="header">
            <h1>Checkboxing</h1>
          </header>
          <div className="left">
            <Board env={env}/>
            <div className="buttonRow">
            <button className="sideButton">Spiel starten</button>
            </div>
          </div>
          <div className="right">
            <SidePanel state={state}/>
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
