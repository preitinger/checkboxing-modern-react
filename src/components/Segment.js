import {useState, useEffect} from 'react'
import nextId from '../nextId'
import Box from './Box'
import './Segment.css'

let effectCounter = 0

const Segment = ({env, rowIdx, segIdx, setSegSize}) => {
  console.log("Segment: env=", env, "segIdx=", segIdx);

  // (a) einzeln
  // const [first, setFirst] = useState(-1);
  // const [last, setLast] = useState(-1);
  // (b) zusammen
  const [state, setState] = useState({first:-1,last:-1});
  useEffect(() => {
    console.log('useEffect', effectCounter++);
  })

  console.log("Segment rendered in state", state);

  const segment = env.state.board.rows[rowIdx].segments[segIdx]

  const boxes = [];

    const onSegEnter = () => {
      setSegSize(segment.size);
    }

    const onSegLeave = () => {
      setSegSize(null);
    }

  const onClick = (boxIdx) => () => {
    console.log("Segment.onClick: boxIdx=", boxIdx);
    const segment = env.state.board.rows[rowIdx].segments[segIdx];
    console.log("segment", segment);
    if (segment.checked) return;
    // (a) einzeln
    // if (first === -1) {
    //   setFirst(boxIdx);
    //   setLast(boxIdx);
    //   return;
    // }
    //
    // onMoveDone(first, boxIdx);
    // setFirst(-1);
    // setLast(-1);

    // (b) zusammen
    if (state.first === -1) {
      setState({first: boxIdx, last: boxIdx});
      env.updateActiveSegId(segment.id);
      return;
    }

    env.updateActiveSegId(-1);
    env.doMove(rowIdx, segIdx, state.first, boxIdx);
    setState({first:-1,last:-1});
  }

  const onEnter = (boxIdx) => () => {
    // setSegSize(segment.size)

    // (a) einzeln
    // if (first === -1) return;
    //
    // setLast(boxIdx);

    // (b) zusammen
    if (state.first === -1) return;

    setState({first: state.first, last: boxIdx});
  }

  const onKeyDown = (event) => {

    if (event.code === "Escape") {
      console.log("Escape");

      if (state.first === -1) return;
      env.updateActiveSegId(-1);
      setState({first: -1, last: -1})
    }
  }

  const insideCurrentMove = (boxIdx) => {
    // (a) einzeln
    // return (first <= boxIdx && boxIdx <= last) || (last <= boxIdx && boxIdx <= first);
    // (b) zusammen
    const first = state.first;
    const last = state.last;
    return (first <= boxIdx && boxIdx <= last) || (last <= boxIdx && boxIdx <= first);
  }

  for (let i = 0; i < segment.size; ++i) {
    // Hier wird nie umsortiert oder hinzugefuegt oder entfernt (ausser wenn es ein neues segment mit einer neuen id waere...),
    // also dieser key ok

    // Achtung! Currying at onClick, onEnter, and doMove, so i.e. onClick(i) returns a function
    boxes.push(
      <Box key={segment.id + '.' + i}
      env={env}
      rowIdx={rowIdx}
      segIdx={segIdx}
      boxIdx={i}
      humanMove={state}
      onClick={onClick(i)}
      onEnter={onEnter(i)}
      />)
  }

  let className = 'segment';
  const mayClick = env.state.botMove.rowIdx === -1 && !segment.checked && (env.state.activeSegId === -1 || env.state.activeSegId === segment.id);
  console.log('mayClick: ', mayClick);
  if (mayClick || state.first !== -1) className += ' mayClick';
  const highlight = env.state.botMove.rowIdx === rowIdx && env.state.botMove.segIdx === segIdx;
  if (highlight) className += ' highlight';
  // console.log(className);

  // debugger

  return (
    <div className={className} onKeyDown={onKeyDown} title={segment.size}
    onMouseEnter={onSegEnter} onMouseLeave={onSegLeave}>
      {/*&nbsp;<span className='lightLabel'>{segment.size}</span>*/}
      {boxes}
    </div>
  )
}

export default Segment
