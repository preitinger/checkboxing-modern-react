import {useState, useEffect} from 'react'
import nextId from '../nextId'
import Box from './Box'
import './Segment.css'
import {min, max} from '../utils/Util'

let effectCounter = 0

const Segment = ({
  seg, botMove, allowed,
  updateOnlyAllowedSegId, doMove, setSegSize
}) => {

  console.log("Segment: allowed=", allowed);

  // (a) einzeln
  // const [first, setFirst] = useState(-1);
  // const [last, setLast] = useState(-1);
  // (b) zusammen
  const [state, setState] = useState({first:-1,last:-1});
  // useEffect(() => {
  //   console.log('useEffect', effectCounter++);
  // })

  const onSegEnter = () => {
    setSegSize(seg.size);
  }

  const onSegLeave = () => {
    setSegSize(null);
  }

  const onClick = (boxIdx) => () => {
    console.log("Segment.onClick: boxIdx=", boxIdx);
    console.log("seg", seg);
    if (seg.checked) return;
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
      updateOnlyAllowedSegId(seg.id);
      return;
    }

    updateOnlyAllowedSegId(-1);
    doMove(state.first, boxIdx);
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
      updateOnlyAllowedSegId(-1);
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

  const boxes = [];

  for (let i = 0; i < seg.size; ++i) {
    // Hier wird nie umsortiert oder hinzugefuegt oder entfernt (ausser wenn es ein neues seg mit einer neuen id waere...),
    // also dieser key ok

    // Achtung! Currying at onClick, onEnter, and doMove, so i.e. onClick(i) returns a function

    const leftIdx = min(state.first, state.last);
    const rightIdx = max(state.first, state.last);

    boxes.push(
      // hier index als key ok da Inhalt von boxes statisch ist
      <Box key={i}
      checked={seg.checked || (leftIdx <= i && i <= rightIdx) || (botMove != null && botMove.first <= i && i <= botMove.last)}
      onClick={onClick(i)}
      onEnter={onEnter(i)}
      />)
  }

  let className = 'segment';
  if (botMove != null) {
    className += " highlight";
  }
  if (allowed && !seg.checked) {
    className += " allowed";
  } else {
    className += " not-allowed"
  }

  // debugger

  return (
    <div className={className} onKeyDown={onKeyDown} title={seg.size}
    onMouseEnter={onSegEnter} onMouseLeave={onSegLeave}>
      {/*&nbsp;<span className='lightLabel'>{segment.size}</span>*/}
      {boxes}
    </div>
  )
}

export default Segment
