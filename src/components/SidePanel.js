// @flow
import {useState, useEffect, useRef} from 'react'
import produce from 'immer';
import '../App.css'
import '../utils/Radio.css'
import SideItem from './SideItem'
import Msg from './Msg'
import React from 'react';


let originalSettings = null;

const SidePanel = ({state, onSettingsUpdate}) => {
  console.log("SidePanel: onSettingsUpdate=", onSettingsUpdate);
  // console.log("SidePanel: state=", state);
  if (!originalSettings) originalSettings = state.settings;
  const [tmpSettings, setTmpSettings] = useState(state.settings);
  const [delayTimerId, setDelayTimerId] = useState(null);
  useEffect(() => {
    onSettingsUpdate(tmpSettings);
  }, [tmpSettings])

  // console.log("originalSettings", originalSettings);
  // console.log("state.settings", state.settings);
  // console.log("tmpSettings", tmpSettings);

  const numRowsChange = (event) => {
    setTmpSettings(produce(tmpSettings, draft => {
      draft.game.rowCount = event.target.value;
    }))
  }
  const animationMsChange = player => (event) => {
    setTmpSettings(produce(tmpSettings, draft => {
      draft.botMoves[player].animationMs = event.target.value;
      }))
  }
  const botChange = (event) => {
    setTmpSettings(produce(tmpSettings, draft => {
      draft.game.bots[event.target.name] = event.target.checked;
    }))
  }
  const lastWinsChange = (event) => {
    // console.log("lastWinsChange entered");
    setTmpSettings(produce(tmpSettings, draft => {
      draft.game.lastWins = (
        event.target.value === "win" && event.target.checked
      ) || (
        event.target.value === "loose" && !event.target.checked
      )
      // console.log("new lastWins", draft.game.lastWins);
    }))
  }
  const priorityChange = player => (event) => {
    if (event.target.checked) {
      setTmpSettings(produce(tmpSettings, draft => {
        draft.botMoves[player].priority = event.value
      }))
    }
  }
  return (
    <div className="sidePanel">
      <SideItem initiallyVisible={false} title={Msg.settings()} content=
      {
        <>
        <fieldset>
          <legend>{Msg.forNextGame()}</legend>
          <ul>
            <li>
              <label htmlFor="numRows">
              {Msg.numRows()}
              </label>
              <input id="numRows" type="number" value={tmpSettings.game.rowCount} onChange={numRowsChange} className="input"/>
            </li>
            <li>
              <label htmlFor="bot0">
              {Msg.botPlaying(0)}
              </label>
              <input id="bot0" name="0" type="checkbox" checked={tmpSettings.game.bots[0]}
              onChange={botChange} className="input"/>
            </li>
            <li>
              <label htmlFor="bot1">
              {Msg.botPlaying(1)}
              </label>
              <input id="bot1" name="1" type="checkbox" checked={tmpSettings.game.bots[1]}
              onChange={botChange} className="input"/>
            </li>
            <li>
              <label htmlFor="lastWins">
              {Msg.lastWins()}
              </label>
              <input id="lastWins" name="lastWins" type="radio" value="win" checked={tmpSettings.game.lastWins}
              onChange={lastWinsChange} className="input"/>
            </li>
            <li>
              <label htmlFor="lastLooses">
              {Msg.lastLooses()}
              </label>
              <input id="lastLooses" name="lastWins" type="radio" value="loose" checked={!tmpSettings.game.lastWins}
              onChange={lastWinsChange} className="input"/>
            </li>
          </ul>
          </fieldset>
          <fieldset>
            <legend>{Msg.forAtOnce(0)}</legend>
            <ul>
              <li>
                <fieldset>
                  <legend>{Msg.priority()}</legend>
                  <ul>
                    <li>
                      <label htmlFor="random0">{Msg.random()}</label>
                      <input type="radio" id="random0" name="priority0" value="random" className="input"/>
                    </li>
                    <li>
                      <label htmlFor="short0">{Msg.short()}</label>
                      <input type="radio" id="short0" name="priority0" value="short" className="input"/>
                    </li>
                    <li>
                      <label htmlFor="long0">{Msg.long()}</label>
                      <input type="radio" id="long0" name="priority0" value="long" className="input"/>
                    </li>
                  </ul>
                </fieldset>
              </li>
              <li>
                <label htmlFor="animationMs0">{Msg.animationMs()}</label>
                <input type="number" id="animationMs0" value={tmpSettings.botMoves[0].animationMs}
                onChange={animationMsChange(0)}/>
              </li>
            </ul>
          </fieldset>
        </>
      }
      />
      <SideItem title={Msg.rules()} initiallyVisible={true} content={
        <div className="rules">
        {Msg.rulesContent()}
        </div>
      }/>
    </div>
  )
}

export default SidePanel
