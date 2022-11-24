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
  })

  // console.log("originalSettings", originalSettings);
  // console.log("state.settings", state.settings);
  // console.log("tmpSettings", tmpSettings);

  const numRowsChange = (event) => {
    setTmpSettings(produce(tmpSettings, draft => {
      draft.game.rowCount = event.target.value;
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
  return (
    <div className="sidePanel">
      <SideItem initiallyVisible={false} title={Msg.settings()} content=
      {
        <>
          <ul>
            <li>
              <label htmlFor="numRows">
              {Msg.numRows()}
              </label>
              <input id="numRows" type="number" value={tmpSettings.game.rowCount} onChange={numRowsChange}/>
            </li>
            <li>
              <label htmlFor="bot0">
              {Msg.botPlaying(0)}
              </label>
              <input id="bot0" name="0" type="checkbox" checked={tmpSettings.game.bots[0]}
              onChange={botChange}/>
            </li>
            <li>
              <label htmlFor="bot1">
              {Msg.botPlaying(1)}
              </label>
              <input id="bot1" name="1" type="checkbox" checked={tmpSettings.game.bots[1]}
              onChange={botChange}/>
            </li>
            <li>
              <label htmlFor="lastWins">
              {Msg.lastWins()}
              </label>
              <input id="lastWins" name="lastWins" type="radio" value="win" checked={tmpSettings.game.lastWins}
              onChange={lastWinsChange}/>
            </li>
            <li>
              <label htmlFor="lastLooses">
              {Msg.lastLooses()}
              </label>
              <input id="lastLooses" name="lastWins" type="radio" value="loose" checked={!tmpSettings.game.lastWins}
              onChange={lastWinsChange}/>
            </li>
          </ul>
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
