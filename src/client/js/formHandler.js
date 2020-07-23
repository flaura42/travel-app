const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const zip = document.getElementById('zip').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const country = document.getElementById('country').value;
  const sDate = document.getElementById('start-date').value;
  const eDate = document.getElementById('end-date').value;
  const loc = {
    zip: zip,
    city: city,
    state: state,
    country: country,
    start: sDate,
    end: eDate
  }
  handleSubmit(loc)
})

export const handleSubmit = async(loc) => {
  try {
    const days = await Client.validateDates(loc.start, loc.end)
    if (days === false) { return }
    const vLoc = await Client.validateDest(loc);
    if (vLoc === false) { return }

    const coords = await handleGeo(vLoc)
    if (coords) {
      const weather = await handleWb(coords)
      const wCheck = await processWeather(weather, days);
      if (wCheck === true) { Client.loadResults() }
    }
    else { return }
    // Client.loadResults()
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
    if (data === false) {
      alert('So sorry! Your location did not return any results.  Please verify your entries or try a neighboring city');
      return data
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

const processWeather = async(wData, days) => {
  const data = {
    city: wData.city_name,
    state: wData.state_code,
    country: wData.country_code,
    timezone: wData.timezone,  // Local IANA Timezone
    weather: []
  }

  for (let i=days[0]; i<days[1] ; i++) {
    const ndate = new Date(wData.data[i].valid_date)
    const date = ndate.toLocaleDateString()
    const maxTemp = Math.round(wData.data[i].max_temp)
    const minTemp = Math.round(wData.data[i].min_temp)
    const pop = wData.data[i].pop // Probability of Precipitation %
    const humid = wData.data[i].rh  // Average relative humidity %
    const wind = wData.data[i].wind_spd  // wind speed m/s
    const icon = wData.data[i].weather.icon.replace('n', 'd')
    const wf = {
      date: date,
      high: maxTemp,
      low: minTemp,
      pop: pop,
      humid: humid,
      wind: wind,
      icon: icon
    }
    data.weather.push(wf)
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
