import '../App.css'
import Msg from './Msg'

const Commentation = ({state}) => {
  const gameRunning = state.player >= 0;
  let isBot = (gameRunning && state.settings.game.bots[state.player]);
  const oneBot = (state.settings.game.bots[0] !== state.settings.game.bots[1]);

  return (
    <div className="commentation">
      <p className="lightHint">
        {Msg.currentVariant()}
        <em>
          {Msg.lastWinsVariant(state.settings.game.lastWins)}
        </em>
      </p>
      {
        gameRunning ? (
          isBot ? (oneBot ? Msg.botsTurn() : Msg.botNrsTurn(state.player))
          : (oneBot ? Msg.humansTurn() : Msg.humanNrsTurn(state.player))
        ) : Msg.requestStart()
      }
    </div>
  )
}

export default Commentation;
