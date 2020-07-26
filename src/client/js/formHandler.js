const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('click', (e) => {
  e.preventDefault()

  const section = document.getElementById('results-section')
  section.innerHTML=''

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
  console.log('form data', loc);
  Client.addData(loc)
  handleSubmit(loc)
})

export const handleSubmit = async(loc) => {
  try {
    let range = {}
    const valDate = await Client.validateDates(loc.start, loc.end)
    if (!valDate) { return }
    else { range = Client.getDateRange(loc.start, loc.end)}
    const vLoc = await Client.validateDest(loc);
    if (vLoc === false) { return }

    const coords = await handleGeo(vLoc)
    if (coords) {
      const weather = await handleWb(coords, range)
      await Client.processWeather(weather, range);
      await handlePix()
      Client.loadResults()
    }
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
    Client.addData(data)
    return data
  } catch(e) {
    console.log('handleGeo error: ', e);
  }
}

const handleWb = async(coords, range) => {
  console.log(range)
  const response = await fetch('http://localhost:8000/wb', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coords: coords,
      range: range
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

const handlePix = async() => {
  const d = await Client.getAll()
  const dest = {
    city: d.city,
    state: d.state,
    country: d.country
  }
  const response = await fetch('http://localhost:8000/pix', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dest: dest
    })
  })
  try {
    let pixUrl
    const data = await response.json()
    if (!data) {
      pixUrl = 'b798cf65cc50b33b79005263c54b32fd.jpg'
      console.log('no images!')
    } else {
      pixUrl = data[0].webformatURL
    }
    processPix(pixUrl)
  } catch(e) {
    console.log('handlePix error: ', e);
  }
}

const processPix = async(pix) => {
  try {
    const res = await fetch('http://localhost:8000/add', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pixUrl: pix
      })
    })
    const response = await res.json()
  } catch(e) {
    console.log('processWeather error: ', e)
  }
}
