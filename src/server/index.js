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

let projectData = {}

app.post('/add', (req, res) => {
  const data = req.body
  res.status(200).send({
    success: true,
    message: 'data saved',
    data: data
  })
  Object.assign(projectData, data)
  console.log('new projectData: ', projectData)
})

app.delete('/remove', (req, res) => {
  projectData = {}
  console.log('removing')
  console.log('new project data: ', projectData)
})

app.post('/geo', async (req, res) => {
  try {
    const coords = await getGeo(req.body.destination)
    res.send(coords)
  } catch(e) {
    console.log('/geo post error: ', e)
  }
})

const getGeo = async (destination) => {
  const url = `http://api.geonames.org/searchJSON?username=${process.env.GEO_ID}${destination}`
  console.log('getGeo url: ', url);
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.geonames.length !== 0) {
      const lat = data.geonames[0].lat
      const long = data.geonames[0].lng
      return { lat: lat, long: long }
    }
    else { return new Boolean(false) }
  } catch(e) {
    console.log('getGeo error: ', e)
  }
}

app.post('/wb', async (req, res) => {
  try {
    const weather = await getWB(req.body)
    res.send(weather)
  } catch(e) {
    console.log('/wb post error: ', e)
  }
})

// get historical or forecast weather depending on date range
const getWB = async (data) => {
  const lat = data.coords.lat
  const long = data.coords.long
  const start = data.range.isos
  const end = data.range.isoe
  let url =''
  if (start) {
    url = `http://api.weatherbit.io/v2.0/history/daily?units=I&lat=${lat}&lon=${long}&start_date=${start}&end_date=${end}&key=${process.env.WB_KEY}`
  } else {
    url = `http://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=${lat}&lon=${long}&key=${process.env.WB_KEY}`

  }
  console.log('getWB url: ', url);
  try {
    const response = await fetch(url)
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
  const url = `https://pixabay.com/api/?key=${process.env.PIX_KEY}&q=${topic}&safesearch=true&image_type=photo&category=travel`
  console.log('getPix url: ', url);
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
