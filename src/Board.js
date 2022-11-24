import nextId from './nextId'
const mkSeg = (size) => {
  return {
    id: nextId(),
    size: size,
    checked: false,
  }
}

const mkRow = (size) => {
  return {
    id: nextId(),
    segments: [mkSeg(size)]
  }
}

const mkBoard = (size) => {
  const rows = []

  for (let i = 0; i < size; ++i) {
    rows.push(mkRow(i + 1))
  }

  return {
    rows: rows
  }
}

const xorSum = (board) => {
  let x = 0;
  for (let i = 0; i < board.rows.length; ++i) {
    for (let j = 0; j < board.rows[i].segments.length; ++j) {
      x ^= board.rows[i].segments[j].size;
    }
  }

  return x;
}

export {mkBoard, mkRow, mkSeg, xorSum}
