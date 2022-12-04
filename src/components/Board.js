import './Board.css'
import Row from './Row'

const Board = ({
  board, botMove, noneAllowed, onlyAllowedSegId, hourGlass,
  updateOnlyAllowedSegId, doMove
}) => {

  const className = "board";

  return (
    <>
    <div className={hourGlass ? "boardHourGlass boardHourGlassVisible" : "boardHourGlass"}>
      <img border="0" src="https://www.123gif.de/gifs/uhren/uhren-0116.gif" alt="uhren-0116.gif von 123gif.de" />
    </div>
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
    </>
  )

}

export default Board
