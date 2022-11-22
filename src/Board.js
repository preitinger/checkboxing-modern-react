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

export {mkBoard, mkRow, mkSeg}
