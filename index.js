const config = require('config')

const PDFDocument = require('pdfkit')
const fs = require('fs')
const seed = config.seed || String(Math.random()).split('.').pop()
const random = require('seedrandom')(seed);

// Create a document
// bug: this assumes paperSize is "LETTER"
const widthMM = 612
const heightMM = 792

const rows = config.rows
const columns = config.columns
const freeSpaces = config.freeSpaces
const count = config.count

const options = require(config.options)

function draw(options) {
  const index = Math.floor(random() * options.length)
  const option = options.splice(index, 1).pop()
  debug(`\tDrew option ${index}: ${option}`)
  return option
}

function debug(...strings) {
  if (config.debug) console.log(...strings)
}

function verifyOptions(options) {
  debug(options)
  if (freeSpaces.length + options.length < rows * columns)
    throw new Error(`Need ${rows * columns - (freeSpaces.length + options.length)} more option(s) or free space(s) to fill the board.`)
}

function verifyFreeSpaces() {
  let error = ''
  freeSpaces.forEach((space, index) => {
    const xOutOfBounds = space[0] < 0 || space[0] > rows - 1
    const yOutOfBounds = space[1] < 0 || space[1] > columns - 1
    if (xOutOfBounds && yOutOfBounds) {
      error += `Free space ${index} is out of bounds in both X and Y.\n`
    } else if (xOutOfBounds) {
      error += `Free space ${index} is out of bounds in X.\n`
    } else if (yOutOfBounds) {
      error += `Free space ${index} is out of bounds in Y.\n`
    }
  })
  if (error.length) throw new Error(error)
}

verifyFreeSpaces()
verifyOptions(options)

function generateCard(index, options) {
  const doc = new PDFDocument({ size: config.paperSize })
  const cardOptions = [...options]

  // Pipe its output somewhere, like to a file or HTTP response
  doc.pipe(fs.createWriteStream(config.output.replace('%', String(index))))

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      debug(`Populating cell [${i}, ${j}]:`)
      const matchingFreeSpace = freeSpaces.filter((space) => space[0] === j && space[1] === i)[0]
      if (matchingFreeSpace) {
        debug(`\tFree space with text ${matchingFreeSpace[2]}`)
        doc
          .fontSize(12)
          .text(matchingFreeSpace[2], (widthMM / columns)*i, (heightMM / rows)*(j+1), { width: (widthMM / columns), height: (heightMM / rows), align: 'center', baseline: heightMM / rows / 2 })
      } else {
        let text = draw(cardOptions)
        doc
          .fontSize(12)
          .text(text, (widthMM / columns)*i, (heightMM / rows)*(j+1), { width: (widthMM / columns), height: (heightMM / rows), align: 'center', baseline: heightMM / rows / 2 })
      }
    }
  }

  // Finalize PDF file
  doc.end();
}

for (let i = 1; i <= count; i++) {
  generateCard(i, options)
}

if (count === 1) {
  console.log(`Finished generating ${rows}x${columns} bingo card for seed ${seed}.`)
} else {
  console.log(`Finished generating ${count} different ${rows}x${columns} bingo cards for seed ${seed}.`)
}
