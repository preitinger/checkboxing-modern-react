import './Board.css'
import Row from './Row'

const Board = ({env}) => {
  console.log("Board, env=", env);
  return (
    <div className='boardParent'>
    <div className='board' data-testid='board'>
    {env.state.board.rows.map((row, i) => <Row key={row.id} env={env} rowIdx={i}/>)}
    </div>
    </div>
  )
}

export default Board
