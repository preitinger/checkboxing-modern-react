import '../App.css'
import './Box.css'
import '../utils/Checkbox.css'
import {min, max} from '../utils/Util.js'
import checkedImg from '../res/checked.png'

const Box = ({env, rowIdx, segIdx, boxIdx, humanMove, onClick, onEnter}) => {
  // console.log('checked', checked);

  const seg = env.state.board.rows[rowIdx].segments[segIdx];
  const checked = seg.checked || (min(humanMove.first, humanMove.last) <= boxIdx && boxIdx <= max(humanMove.first, humanMove.last))
  const disabled = seg.checked || env.state.botMove.rowIdx != -1 || (env.state.activeSegId !== -1 && env.state.activeSegId !== seg.id)
  return (
    <div className="boxContainer2">
      <input className='box2'
        checked={checked}
        type="checkbox"
        disabled={disabled}
        readOnly
        onClick={onClick}
        onMouseEnter={onEnter}
      />
    </div>
  )

  // const size='15px';
  // // const size='1.15em';
  //
  // return (
  //   <div tabIndex="0" className='box' onClick={onClick} onMouseEnter={onEnter} style={{width:size, height:size}}>
  //     {checked ? <img className='boxImg' src={checkedImg} width={size} height={size}/> : null}
  //   </div>
  // )
}

export default Box
