import Segment from './Segment'
import './Row.css'
import {useState, useRef} from 'react'

const Row = ({env, rowIdx}) => {
  console.log("Row: env=", env, "rowIdx=", rowIdx);
  const [segSize, setSegSize] = useState(null)

  const row = env.state.board.rows[rowIdx];

  return (
    <div className='row'>
    <span className={segSize !== null ? 'segSize' : 'segSize hidden'}>{segSize}</span>
    {row.segments.map((segment, i) =>
      <Segment
        key={segment.id}
        env={env}
        rowIdx={rowIdx}
        segIdx={i}
        setSegSize={setSegSize}
      />
    )}
    </div>
  )
}

export default Row
