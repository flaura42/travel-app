const path = require('path')
const fetch = require('node-fetch');

const express = require('express')
const app = express()
// app.use(express.static('dist'))
app.use(express.static('src/client'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cors = require('cors');
app.use(cors())

const dotenv = require('dotenv');
dotenv.config();

const port = 8000
app.listen(port, () => {
    console.log(`Running on localhost: ${port}`)
})

app.get('/', (req, res) => {
    // res.send('dist/index.html')
    res.send(path.resolve('src/client/views/index.html'))
})

const getGeo = async (place) => {
  const response = await fetch(`http://api.geonames.org/postalCodeSearchJSON?placename=${place}&maxRows=10&username=flaura42`)
  try {
    const data = await response.json()
    const lat = data.postalCodes[0].lat
    const long = data.postalCodes[0].lng
    console.log('from getGeo: ', lat, long);
    return ({lat, long})
  } catch(e) {
    console.log('Error with geo: ', e)
  }
}

app.post('/geo', async (req, res) => {
  const place = req.body.placename
  const coords = await getGeo(place)
  console.log('coords are: ', coords)
  res.send({ coords: coords})
})
