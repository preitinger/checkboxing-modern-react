import './Board.css'
import Row from './Row'

const Board = ({
  board, botMove, noneAllowed, onlyAllowedSegId,
  updateOnlyAllowedSegId, doMove
}) => {

  const className = "board";

  return (
    <div className='boardParent'>
    <div className={className} data-testid='board'>
    {board.rows.map((row, i) =>
      <Row
      key={row.id}
      row={row}
      botMove={botMove.rowIdx === i ? botMove : null}
      noneAllowed={noneAllowed}
      onlyAllowedSegId={onlyAllowedSegId}
      updateOnlyAllowedSegId={updateOnlyAllowedSegId}
      doMove={doMove(i)}
      />)
    }
    </div>
    </div>
  )

}

export default Board
