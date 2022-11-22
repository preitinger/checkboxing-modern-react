import {useState, useRef} from 'react'
import produce from 'immer';
import '../App.css'
import SideItem from './SideItem'

let originalSettings = null;

const SidePanel = ({state}) => {
  console.log("SidePanel: state=", state);
  if (!originalSettings) originalSettings = state.settings;
  const [tmpSettings, setTmpSettings] = useState(state.settings)

  console.log("originalSettings", originalSettings);
  console.log("state.settings", state.settings);
  console.log("tmpSettings", tmpSettings);

  const numRowsChange = (event) => {
    setTmpSettings(produce(draft => {
      draft.game.rowCount = event.target.value;
    }))
  }
  const botChange = (event) => {
    setTmpSettings(produce(draft => {
      draft.game.bots[event.target.name] = event.target.checked;
    }))
  }
  const lastWinsChange = (event) => {
    console.log("lastWinsChange entered");
    setTmpSettings(produce(draft => {
      draft.game.lastWins = (
        event.target.value === "win" && event.target.checked
      ) || (
        event.target.value === "loose" && !event.target.checked
      )
      console.log("new lastWins", draft.game.lastWins);
    }))
  }
  return (
    <div className="sidePanel">
      <SideItem initiallyVisible={true} title="Einstellungen" content=
      {
        <>
          <ul>
            <li>
              <label htmlFor="numRows">
              Anzahl Zeilen
              </label>
              <input id="numRows" type="number" value={tmpSettings.game.rowCount} onChange={numRowsChange}/>
            </li>
            <li>
              <label htmlFor="bot0">
              Computer spielt für Spieler 1
              </label>
              <input id="bot0" name="0" type="checkbox" checked={tmpSettings.game.bots[0]}
              onChange={botChange}/>
            </li>
            <li>
              <label htmlFor="bot1">
              Computer spielt für Spieler 2
              </label>
              <input id="bot1" name="1" type="checkbox" checked={tmpSettings.game.bots[1]}
              onChange={botChange}/>
            </li>
            <li>
              <label htmlFor="lastWins">
              Mit letztem Zug gewinnen
              </label>
              <input id="lastWins" name="lastWins" type="radio" value="win" checked={tmpSettings.game.lastWins}
              onChange={lastWinsChange}/>
            </li>
            <li>
              <label htmlFor="lastLooses">
              Mit letztem Zug verlieren
              </label>
              <input id="lastLooses" name="lastWins" type="radio" value="loose" checked={!tmpSettings.game.lastWins}
              onChange={lastWinsChange}/>
            </li>
          </ul>
        </>
      }
      />
      <SideItem title="Spielregeln" initiallyVisible={true} content={
        <div className="rules">
        2 Spieler checken abwechselnd zusammenhängende Abschnitte von Checkboxen
        in einer Zeile. In Zeile 1 befindet sich nur eine Checkbox, in der nächsten eine mehr usw.
        Ein gecheckter Abschnitt darf aus beliebig vielen bisher ungecheckten Checkboxen nebeneinander bestehen.
        Das Spiel endet, wenn alle Checkboxen gecheckt sind.
        Je nach eingestellter Variante verliert oder gewinnt derjenige Spieler,
        der die letzte Checkbox gecheckt hat.
        </div>
      }/>
    </div>
  )
}

export default SidePanel
