const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const zip = document.getElementById('zip').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const country = document.getElementById('country').value;
  const date = document.getElementById('date').value;
  const loc = {
    zip: zip,
    city: city,
    state: state,
    country: country,
    date: date
  }
  handleSubmit(loc)
})

export const handleSubmit = async(loc) => {
  try {
    const vLoc = await Client.validateDest(loc);
    if (vLoc === false) { return }
    const coords = await handleGeo(vLoc)
    // const coords = { lat: 47.9, long: -122.2 }
    const weather = await handleWb(coords)
    const wCheck = await processWeather(weather);
    if (wCheck === true) { Client.loadResults() }  
  } catch(e) {
    console.log('handleSubmit error: ', e);
  }
}

const handleGeo = async(loc) => {
  const response = await fetch('http://localhost:8000/geo', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      destination: loc
    })
  })
  try {
    const data = await response.json()
    if (!data) {
      alert('So sorry! Your location did not return any results.  Please verify your entries or try a neighboring city');
      return
    }
    console.log('handleGeo Data: ', data)
    return data
  } catch(e) {
    console.log('handleGeo error: ', e);
  }
}

const handleWb = async(coords) => {
  const response = await fetch('http://localhost:8000/wb', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coords: coords
    })
  })
  try {
    const data = await response.json()
    console.log('handleWb Data: ', data)
    return data
  } catch(e) {
    console.log('handleWb error: ', e);
  }
}

const processWeather = async(wData) => {
  const data = {
    city: wData.city_name,
    state: wData.state_code,
    country: wData.country_code,
    timezone: wData.timezone,  // Local IANA Timezone
    weather: [
      {
        minTemp: wData.data[0].min_temp,
        maxTemp: wData.data[0].max_temp,
        date: wData.data[0].valid_date,  // yyyy-mm-dd
        pop: wData.data[0].pop,  // Probability of Precipitation %
        humid: wData.data[0].rh,  // Average relative humidity %
        wIcon: wData.data[0].weather.icon.replace('n', 'd')
      },
      {
        minTemp: wData.data[1].min_temp,
        maxTemp: wData.data[1].max_temp,
        date: wData.data[1].valid_date,  // yyyy-mm-dd
        pop: wData.data[1].pop,  // Probability of Precipitation %
        humid: wData.data[1].rh,  // Average relative humidity %
        wIcon: wData.data[1].weather.icon.replace('n', 'd')
      }
    ]
  }
  try {
    const res = await fetch('http://localhost:8000/add', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const response = await res.json()
    return true;
  } catch(e) {
    console.log('processWeather error: ', e)
  }
}
