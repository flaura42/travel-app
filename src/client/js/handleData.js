export const addData = async(data) => {
  try {
    console.log('Adding data: ', data)
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
  } catch(e) {
    console.log('addData error: ', e)
  }
}

export const checkData = async() => {
  try {
    const data = await Client.getAll()
    let state
    let country
    if (data.state.length === 2) {
      const states = await Client.getStates()
      state = Object.getOwnPropertyDescriptor(states, data.state).value
    } else {
      state = data.state
    }
    if (data.country.length === 2) {
      const countries = await Client.getCountries()
      country = Object.getOwnPropertyDescriptor(countries, data.country).value
    } else {
      country = data.country
    }
    const newData = {
      state: state,
      country: country
    }
    addData(newData)
  } catch(e) {
    console.log('checkData error', e)
  }
}

export const processWeather = (wData, range) => {
  const data = {
    timezone: wData.timezone,  // Local IANA Timezone
    lat: wData.lat,
    long: wData.lon,
    weather: []
  }
  // historical weather
  if (range.isos) {
    let vdate = wData.data[0].datetime
    let month = vdate.slice(5, 7)
    let day = vdate.slice(8, 10)
    let year = vdate.slice(0, 4)
    let date = `${month}/${day}/${year}`
    const maxTemp = Math.round(wData.data[0].max_temp)
    const minTemp = Math.round(wData.data[0].min_temp)
    const humid = wData.data[0].rh  // Average relative humidity %
    const wind = wData.data[0].wind_spd  // wind speed m/s
    const wh = {
      date: date,
      high: maxTemp,
      low: minTemp,
      humid: humid,
      wind: wind,
    }
    data.weather.push(wh)
  // forecast weather
  } else {
    let s = 0
    for (let i=range.sOffset; i<=range.eOffset; i++) {
      s++
      // limit number of forecasts to display
      if (s > 5) { break }
      if (i > 15) { break }
      let vdate = wData.data[i].valid_date
      let month = vdate.slice(5, 7)
      let day = vdate.slice(8, 10)
      let year = vdate.slice(0, 4)
      let date = `${month}/${day}/${year}`
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
  }
  addData(data)
  checkData()
}
