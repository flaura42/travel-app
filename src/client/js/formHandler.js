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
    const vStart = await Client.validateDate(loc.start)
    if (vStart === false) { return }
    const start = await setDate(vStart)
    console.log('start: ', start);

    const vEnd = await Client.validateDate(loc.end)
    if (vEnd === false) { return }
    const end = await setDate(vEnd)
    console.log('end: ', end);

    const vLoc = await Client.validateDest(loc);
    if (vLoc === false) { return }
    const coords = await handleGeo(vLoc)
    // const coords = { lat: 47.9, long: -122.2 }
    const weather = await handleWb(coords)
    const wCheck = await processWeather(weather, start, end);
    if (wCheck === true) { Client.loadResults() }
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

const processWeather = async(wData, start, end) => {
  const data = {
    city: wData.city_name,
    state: wData.state_code,
    country: wData.country_code,
    timezone: wData.timezone,  // Local IANA Timezone
    weather: []
  }

  for (let i=start; i<end+1 ; i++) {
    const ndate = new Date(wData.data[i].valid_date)
    const date = ndate.toLocaleDateString()
    const maxTemp = Math.round(wData.data[i].max_temp)
    const minTemp = Math.round(wData.data[i].min_temp)
    const pop = wData.data[i].pop // Probability of Precipitation %
    const humid = wData.data[i].rh  // Average relative humidity %
    const icon = wData.data[i].weather.icon.replace('n', 'd')
    const wf = {
      date: date,
      high: maxTemp,
      low: minTemp,
      pop: pop,
      humid: humid,
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

const setDate = async(date) => {
  try {
    const newD = new Date()
    const now = Date.parse(newD)
    const tripS = Date.parse(date)
    const diff = tripS - now
    let day = 86400000
    let days = diff / day
    if (days >= Math.round(diff / day)) {
      let days = Math.round(diff / day) + 2
      return days
    } else {
      let days = Math.round(diff / day) + 1
      return days
    }
  } catch(e) {
    console.log('setDate error: ', e)
  }
}
