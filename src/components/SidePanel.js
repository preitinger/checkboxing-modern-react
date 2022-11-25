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
    console.log("priorityChange: player=", player + ", event.target.value=", event.target.value);
    if (event.target.checked) {
      setTmpSettings(produce(tmpSettings, draft => {
        draft.botMoves[player].priority = event.target.value
      }))
    }
  }

  const botMoveSettings = (player) =>
    <fieldset>
      <legend>{Msg.forAtOnce(player)}</legend>
      <fieldset>
        <legend>{Msg.priority()}</legend>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor={"random" + player}>{Msg.random()}</label>
              </td>
              <td>
                <input type="radio" id={"random" + player} name={"priority" + player}
                checked={tmpSettings.botMoves[player].priority === "random"}
                onChange={priorityChange(player)}
                value="random" className="input"/>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor={"short" + player}>{Msg.short()}</label>
              </td>
              <td>
                <input type="radio" id={"short" + player} name={"priority" + player}
                checked={tmpSettings.botMoves[player].priority === "short"}
                onChange={priorityChange(player)}
                value="short" className="input"/>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor={"long" + player}>{Msg.long()}</label>
              </td>
              <td>
                <input type="radio" id={"long" + player} name={"priority" + player}
                checked={tmpSettings.botMoves[player].priority === "long"}
                onChange={priorityChange(player)}
                value="long" className="input"/>
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor={"animationMs" + player}>{Msg.animationMs()}</label>
            </td>
            <td>
              <input type="number" id={"animationMs" + player} value={tmpSettings.botMoves[player].animationMs}
              onChange={animationMsChange(player)}/>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>;

  return (
    <div className="sidePanel">
      <SideItem initiallyVisible={false} title={Msg.settings()} content=
      {
        <>
        <fieldset>
          <legend>{Msg.forNextGame()}</legend>
          <table>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="numRows">
                    {Msg.numRows()}
                  </label>
                </td>
                <td>
                  <input id="numRows" type="number" value={tmpSettings.game.rowCount} onChange={numRowsChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="bot0">
                  {Msg.botPlaying(0)}
                  </label>
                </td>
                <td>
                  <input id="bot0" name="0" type="checkbox" checked={tmpSettings.game.bots[0]}
                  onChange={botChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="bot1">
                  {Msg.botPlaying(1)}
                  </label>
                </td>
                <td>
                  <input id="bot1" name="1" type="checkbox" checked={tmpSettings.game.bots[1]}
                  onChange={botChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="lastWins">
                  {Msg.lastWins()}
                  </label>
                </td>
                <td>
                  <input id="lastWins" name="lastWins" type="radio" value="win" checked={tmpSettings.game.lastWins}
                  onChange={lastWinsChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="lastLooses">
                  {Msg.lastLooses()}
                  </label>
                </td>
                <td>
                  <input id="lastLooses" name="lastWins" type="radio" value="loose" checked={!tmpSettings.game.lastWins}
                  onChange={lastWinsChange} className="input"/>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
        {botMoveSettings(0)}
        {botMoveSettings(1)}
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
