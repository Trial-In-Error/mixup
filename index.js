const config = require('config')

const PDFDocument = require('pdfkit')
const fs = require('fs')
const seed = config.seed || String(Math.random()).split('.').pop()
const random = require('seedrandom')(seed);

// Create a document
const doc = new PDFDocument({ size: config.paperSize })

// bug: this assumes paperSize is "LETTER"
const widthMM = 612.00
const heightMM = 792.00

const rows = config.rows
const columns = config.columns
const freeSpaces = config.freeSpaces

const options = require(config.options)

function draw(options) {
  const index = Math.floor(random() * options.length)
  const option = options.splice(index, 1)
  debug(`Drew option ${index}: ${option}`)
  return option
}

function debug(...strings) {
  if (config.debug) console.log(...strings)
}

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream(config.output))

for(let i = 0; i < columns; i++) {
  debug('Starting row', i)
  for(let j = 0; j < rows; j++) {
  debug('Starting column', j)
    const matchingFreeSpace = freeSpaces.filter((space) => space[0] === j && space[1] === i)[0]
    if (matchingFreeSpace) {
      doc
        .fontSize(12)
        .text(matchingFreeSpace[2], (widthMM / columns)*i, (heightMM / rows)*(j+1), { width: (widthMM / columns), height: (heightMM / rows), align: 'center', baseline: heightMM / rows / 2 })
    } else {
      doc
        .fontSize(12)
        .text(draw(options), (widthMM / columns)*i, (heightMM / rows)*(j+1), { width: (widthMM / columns), height: (heightMM / rows), align: 'center', baseline: heightMM / rows / 2 })
    }
  }
}

// Finalize PDF file
doc.end();

console.log(`Finished generating ${rows}x${columns} bingo card for seed ${seed}.`)
