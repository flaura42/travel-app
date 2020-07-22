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

const projectData = {}

app.post('/add', (req, res) => {
  const data = req.body
  res.status(200).send({
    success: true,
    message: 'data saved',
    data: data
  })
  Object.assign(projectData, data)
  console.log('updated projectData: ', projectData)
})

app.get('/all', (req, res) => {
  res.send(projectData)

})

const getGeo = async (destination) => {
  const url = `http://api.geonames.org/postalCodeSearchJSON?${destination}&maxRows=10&username=${process.env.GEO_ID}`
  console.log('url: ', url);
  const response = await fetch(url)
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
  try {
    const destination = req.body.destination
    console.log('Place to search: ', destination)
    const coords = await getGeo(destination)
    res.send(coords)
  } catch(e) {
    console.log('/geo Post error: ', e)
  }
})


const getWB = async (lat, long) => {
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=${lat}&lon=${long}&key=${process.env.WB_KEY}`
  console.log('url: ', url);
  const response = await fetch(url)
  try {
    const data = await response.json()
    return data
  } catch(e) {
    console.log('Error with WB: ', e)
  }
}

app.post('/wb', async (req, res) => {
  try {
    // coords: {lat: 47.9, long: -122.2 }
    const lat = req.body.coords.lat
    const long = req.body.coords.long
    const coords = req.body
    // console.log('getting coords')
    console.log('coords: ', lat, long)
    const weather = await getWB(lat, long)
    // console.log('weather forcast is: ', weather)
    res.send(weather)
  } catch(e) {
    console.log('/wb Post error: ', e)
  }
})
