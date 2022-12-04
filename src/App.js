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
// import Timer from './utils/Timer.tsx'
import './components/Board.css'
import Board2 from './components/Board2'
import Commentation from './components/Commentation'
import SplitPane from './utils/SplitPane'
import VSplitPane from './utils/VSplitPane'
import HSplitPane from './utils/HSplitPane'

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
        console.log("animationMs", draft.settings.botMoves[draft.player].animationMs);
        draft.botMoveTime = Date.now() + draft.settings.botMoves[draft.player].animationMs;
        console.log("draft.botMove was set to ", move, "botMoveTime to ", draft.botMoveTime);
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
  draft.botMoveTime = null;

  if (gameOver(draft.board)) {
    console.log("Game over!");
    draft.player = -1;
    return;
  }

  // wenn Spiel nicht zuende, naechsten Zug beginnen
  evtlStartBotMove(draft);
}

const BOARD_UPDATE_MS = 800;

const App = () => {
  // // TODO begin test
  // return <Root/>
  // // TODO end test


  // console.log("settings", settings);
  const [state, setState] = useState(() => {
    const settings = makeSettings();
    const draft = {
      settings: settings,
      nextSettings: settings,
      pendingBoard: null,
      board: mkBoard(settings.game.rowCount),
      player: -1,
      botMove: Move.mkMove2(), // initially empty move
      botMoveTime: null,
      onlyAllowedSegId: -1,
    }
    evtlStartBotMove(draft);
    return draft;
  });
  const [pendingBoardTimerId, setPendingBoardTimerId] = useState(null);
  const [leftWidth, setLeftWidth] = useState(100);

  // Das Callback-Argument von useEffect wird genau einmal nach jedem render- oder re-render-
  // Vorgang aufgerufen.
  useEffect(() => {
    // neu:
    if (state.botMoveTime != null) {
      const timerId = setTimeout(() => {
        setState(s => produce(s, draft => {
          doMoveAndContinue(draft, draft.botMove);
        }))
      }, state.botMoveTime - Date.now());
      return () => {
        clearTimeout(timerId);
      }
    }

    // // alt:
    // console.warn("useEffect 1");
    // if (state.player === -1) return;
    // console.warn("useEffect 2");
    //
    // if (state.settings.game.bots[state.player]) {
    //   console.warn("useEffect 3");
    //   if (state.botMove == null || state.botMove.rowIdx === -1) {
    //     console.error("botMove null or empty ");
    //     return;
    //   }
    //
    //   console.warn("before setTimeout");
    //   const timer = setTimeout(() => {
    //     setState(s => produce(s, draft => {
    //       console.warn("in Timer-Funktion: draft.botMove.rowIdx=", draft.botMove.rowIdx);
    //       doMoveAndContinue(draft, draft.botMove);
    //     }))
    //
    //   }, state.settings.botMoves[state.player].animationMs);
    //   return () => {
    //     console.warn("before clearTimeout");
    //     clearTimeout(timer);
    //   }
    // }
  });

  //
  useEffect(() => {
    if (state.pendingBoard != null) {
      const timeoutId = setTimeout(() => {
        setState(s => produce(s, draft => {
          draft.board = draft.pendingBoard;
          draft.pendingBoard = null;
        }))
        setPendingBoardTimerId(null);
      }, BOARD_UPDATE_MS)
      setPendingBoardTimerId(oldTimer => {
        if (oldTimer != null) {
          clearTimeout(oldTimer);
        }
        return timeoutId;
      });
      return () => {
        clearTimeout(timeoutId);
      }
    }
  }, [state.pendingBoard])



  const onSettingsUpdate = (tmpSettings) => {
    console.log("onSettingsUpdate: tmpSettings=", tmpSettings);

      setState(s => produce(s, draft => {
        draft.nextSettings = tmpSettings;

        if (draft.player === -1) {
          draft.settings = tmpSettings;
          draft.pendingBoard = mkBoard(tmpSettings.game.rowCount);
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

  const onSplitterMouseDown = (event) => {
    event.preventDefault();
    const oldX = event.screenX;
    const oldWidth = leftWidth;

      const onSplitterMouseMove = (event) => {
        event.preventDefault();
        setLeftWidth(oldWidth + (event.screenX - oldX));
        console.log("onSplitterMouseMove")
      }

        const onSplitterMouseUp = (event) => {
          event.preventDefault();
          console.log("onSplitterMouseUp")
          window.removeEventListener('mousemove', onSplitterMouseMove);
          window.removeEventListener('mouseup', onSplitterMouseUp);
        }

    window.addEventListener('mousemove', onSplitterMouseMove);
    window.addEventListener('mouseup', onSplitterMouseUp);
    console.log("onSplitterMouseDown");
  }

  // const testRows2 = [];
  // for (let i = 0; i < state.settings.game.rowCount; ++i) {
  //   const testBoxes = [];
  //   for (let j = 0; j < i + 1; ++j) {
  //     testBoxes.push(
  //       <div className="boxContainer2">
  //         <input type="checkbox" readOnly/>
  //       </div>
  //     );
  //   }
  //   testRows2.push(
  //     <div className="row2">
  //     {testBoxes}
  //     </div>
  //   );
  // }

    // return (
    //   <React.StrictMode>
    //     <div className="main">
    //       <header className="header">
    //         <h1>Checkboxing</h1>
    //       </header>
    //       <div className="left">
    //         <div className='boardParent'>
    //         <Board
    //         board={state.board}
    //         botMove={state.botMove}
    //         noneAllowed={state.player === -1 || state.settings.game.bots[state.player]}
    //         onlyAllowedSegId={state.onlyAllowedSegId}
    //         updateOnlyAllowedSegId={updateOnlyAllowedSegId}
    //         doMove={doMove}
    //         />
    //         </div>
    //         <div className="buttonRow">
    //         <button className="sideButton" onClick={onStart}>Spiel starten</button>
    //         </div>
    //       </div>
    //       <div className="right">
    //         <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
    //       </div>
    //       <footer className="footer">
    //         <a href="https://de.freepik.com/vektoren-kostenlos/haekchen-und-kreuzsymbole-in-flachen-stilen_18141266.htm#query=checkbox&position=0&from_view=keyword" target="_blank">Bild von starline</a> auf Freepik
    //         <img src={checkedImg} width='20px'/>
    //         <fieldset>
    //           <legend>Layout Test</legend>
    //           <div className="testBoard2">
    //           <div className="boardWrap2">
    //           <div className="board2">
    //             {testRows2}
    //           </div>
    //           </div>
    //           <div className='sidePanelContainer2'>
    //           <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
    //           </div>
    //           </div>
    //         </fieldset>
    //       </footer>
    //     </div>
    //   </React.StrictMode>
    // );

  // return (
  //   <>
  //   <div className="out">
  //     <div className="oben">
  //       <div className="oben-0">
  //         <h1>Checkboxing</h1>
  //       </div>
  //       <div className="oben-1">
  //         <button className="sideButton" onClick={onStart}>{Msg.startGame()}</button>
  //       </div>
  //     </div>
  //     <div className="main">
  //       <div className="main-02">
  //       <Commentation state={state}/>
  //         <div className="main-02-00">
  //           <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
  //         </div>
  //       </div>
  //       <div className="main-01">
  //         <Board
  //         board={state.board}
  //         botMove={state.botMove}
  //         noneAllowed={state.player === -1 || state.settings.game.bots[state.player]}
  //         onlyAllowedSegId={state.onlyAllowedSegId}
  //         hourGlass={state.pendingBoard != null}
  //         updateOnlyAllowedSegId={updateOnlyAllowedSegId}
  //         doMove={doMove}
  //         />
  //       </div>
  //     </div>
  //     <div className="unten">
  //       <a href="https://de.freepik.com/vektoren-kostenlos/haekchen-und-kreuzsymbole-in-flachen-stilen_18141266.htm#query=checkbox&position=0&from_view=keyword" target="_blank">Bild von starline</a> auf Freepik
  //     </div>
  //   </div>
  //   </>
  // )

  // return (
  //   <div className="ywrapper">
  //     <div className="wrapper">
  //       <div className="left" data-testid="left" style={{width: leftWidth + "px"}}>
  //       left
  //       </div>
  //       <div className="right">
  //       right
  //         <div className="splitter" data-testid="sidePanelSplitter"
  //         onMouseDown={onSplitterMouseDown}
  //         >
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  if (false) return (
    <SplitPane
    left={
      <SplitPane
      north={
        <Commentation state={state}/>
      }
      left={
        <div className="main-02-00">
          <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
        </div>
      }
      />
    }
    right={
      <>
      right
      </>
    }
    north={
      <div className="oben">
        <div className="oben-0">
          <h1>Checkboxing</h1>
        </div>
        <div className="oben-1">
          <button className="sideButton" onClick={onStart}>{Msg.startGame()}</button>
        </div>
      </div>
    }
    south={
      <>
      south
      </>
    }
    />
  )

  return (
    <VSplitPane list={[

      <div className="oben">
        <div className="oben-0">
          <h1>Checkboxing</h1>
        </div>
        <div className="oben-1">
          <button className="sideButton" onClick={onStart}>{Msg.startGame()}</button>
        </div>
      </div>

      ,

      <HSplitPane list={[

        <VSplitPane list={[

          <Commentation state={state}/>,

          <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>

        ]}/>,

          <Board
          board={state.board}
          botMove={state.botMove}
          noneAllowed={state.player === -1 || state.settings.game.bots[state.player]}
          onlyAllowedSegId={state.onlyAllowedSegId}
          hourGlass={state.pendingBoard != null}
          updateOnlyAllowedSegId={updateOnlyAllowedSegId}
          doMove={doMove}
          />

      ]}/>

      ,

      <p>south bla bla ;-) nyi</p>
    ]}/>
  )
}

export default App;
