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

app.get('/all', (req, res) => { res.send(projectData) })

const countries = require('../client/data/countries.json')
app.get('/getC', (req, res) => { res.send(countries) })

const states = require('../client/data/states.json')
app.get('/getS', (req, res) => { res.send(states) })

const projectData = {}

app.post('/add', (req, res) => {
  const data = req.body
  res.status(200).send({
    success: true,
    message: 'data saved',
    data: data
  })
  Object.assign(projectData, data)
  console.log('Updated projectData: ', projectData)
})

app.post('/geo', async (req, res) => {
  try {
    const destination = req.body.destination
    console.log('Place to search: ', destination)
    const coords = await getGeo(destination)
    res.send(coords)
  } catch(e) {
    console.log('/geo post error: ', e)
  }
})

const getGeo = async (destination) => {
  const url = `http://api.geonames.org/postalCodeSearchJSON?${destination}&maxRows=10&username=${process.env.GEO_ID}`
  console.log('url: ', url);
  const response = await fetch(url)
  try {
    const data = await response.json()
    if (data.postalCodes.length !== 0) {
      const lat = data.postalCodes[0].lat
      const long = data.postalCodes[0].lng
      console.log('from getGeo: ', lat, long);
      return ({lat, long})
    }
    else { return new Boolean(false) }
  } catch(e) {
    console.log('getGeo error: ', e)
  }
}

app.post('/wb', async (req, res) => {
  try {
    const lat = req.body.coords.lat
    const long = req.body.coords.long
    const start = req.body.range.isos
    const end = req.body.range.isoe
    console.log('coords: ', lat, long)
    const weather = await getWB(lat, long, start, end)
    res.send(weather)
  } catch(e) {
    console.log('/wb post error: ', e)
  }
})

// get historical or forecast weather depending on date range
const getWB = async (lat, long, start, end) => {
  let url =''
  if (start) {
    url = `http://api.weatherbit.io/v2.0/history/daily?units=I&lat=${lat}&lon=${long}&start_date=${start}&end_date=${end}&key=${process.env.WB_KEY}`
    console.log('url: ', url);
  } else {
    url = `http://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=${lat}&lon=${long}&key=${process.env.WB_KEY}`
    console.log('url: ', url);
  }
  const response = await fetch(url)
  try {
    const data = await response.json()
    return data
  } catch(e) {
    console.log('getWB error: ', e)
  }
}

app.post('/pix', async (req, res) => {
  try {
    const images = await getPix(req.body)
    res.send(images)
  } catch(e) {
    console.log('/pix post error: ', e)
  }
})

const getPix = async (dest) => {
  const city = encodeURIComponent(dest.dest.city)
  const state = encodeURIComponent(dest.dest.state)
  const country = encodeURIComponent(dest.dest.country)
  let topic
  if (state) {
    topic = `${city}+${state}`
  } else {
    topic = `${city}+${country}`
  }
  console.log('image search: ', topic)

  const url = `https://pixabay.com/api/?key=${process.env.PIX_KEY}&q=${topic}&safesearch=true`
  console.log('url: ', url);
  const response = await fetch(url)
  try {
    const data = await response.json()
    if (data.hits.length !== 0) {
      const images = data.hits
      console.log('from getPix: ', images.length);
      return images
    }
    else { return new Boolean(false) }
  } catch(e) {
    console.log('getPix error: ', e)
  }
}
