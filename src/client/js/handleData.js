export const addData = async(data) => {
  try {
    console.log('Adding data: ', data)
    const res = await fetch('http://localhost:8000/add', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const response = await res.json()
  } catch(e) {
    console.log('addData error: ', e)
  }
}

export const removeData = async() => {
  let data = ''
  try {
    console.log('clearing data, i think')
    return fetch('http://localhost:8000/remove', {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    })
    const response = await res.json()
  } catch(e) {
    console.log('removeData error: ', e)
  }
}


// TODO: Try to make less convoluted
export const checkData = async(newData) => {
  try {
    console.log('checking data')
    let data
    let savedData = await Client.getAll()
    if (savedData) {
      data =  {
        ...savedData,
        ...newData
      }
    } else {
      data = newData
    }

    let state
    let stateID
    let country
    let countryID

    const states = await Client.getStates()
    if (data.state === null || data.state === undefined) {
      state = ''
    }
    if (data.state && data.state.length === 2) {
      let stateD = data.state.toUpperCase()
      state = Object.getOwnPropertyDescriptor(states, stateD).value
    }
    if (data.stateID && !state) {
      state = Object.getOwnPropertyDescriptor(states, data.stateID).value
    }
    if (data.state) {
      state = data.state
    }

    if (data.stateID === null || data.stateID === undefined) {
      console.log('should not be getting stateID from null/und: ')
      stateID = ''
    }
    if (data.stateID) {
      console.log('should not be getting stateID, has id: ')
      stateID = data.stateID
    }
    if (!data.stateID && state) {
      stateID = Object.getOwnPropertyDescriptor(states, state)
      console.log('should be getting stateID: ')
    }

    const countries = await Client.getCountries()
    if (data.country === null || data.country === undefined) {
      country = ''
    }
    if (data.country && data.country.length === 2) {
      country = Object.getOwnPropertyDescriptor(countries, data.country).value
    }
    if (data.countryID && !country) {
      country = Object.getOwnPropertyDescriptor(countries, data.countryID).value
    }
    if (data.country) {
      country = data.country
    }

    if (data.countryID === null || data.countryID === undefined) {
      countryID = ''
    }
    if (!data.countryID && country) {
      countryID = Object.getOwnPropertyDescriptor(countries, country)
    }
    if (data.countryID) {
      countryID = data.countryID
    }

    data = {
      city: data.city,
      state: state,
      stateID: stateID,
      country: country,
      countryID: countryID
    }
    addData(data)
    return data
  } catch(e) {
    console.log('checkData error', e)
  }
}

export const processWeather = (wData, range) => {
  let tzone = wData.timezone
  let timez = tzone.replace('_', ' ')
  let timezone = timez.replace('/', ' / ')
  const data = {
    city: wData.city_name,
    stateID: wData.state_code,
    countryID: wData.country_code,
  }
  const newData = {
    timezone: timezone,  // Local IANA Timezone
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
    newData.weather.push(wh)
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
      newData.weather.push(wf)
    }
  }
  checkData(data)
  addData(newData)
}
