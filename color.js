const path = require('path')
const getPixels = require("get-pixels")
const { extractColors } = require('extract-colors')

const src = path.join(__dirname, 'public', 'logo.png')
const url = "https://media.themoviedb.org/t/p/w440_and_h660_face/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg"

getPixels(url, (err, pixels) => {
  if(!err) {
    const data = [...pixels.data]
    const [width, height] = pixels.shape

    console.log(data)

    extractColors({ data, width, height })
      .then(console.log)
      .catch(console.log)
  }
})