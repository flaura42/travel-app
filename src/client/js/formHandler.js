const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const section = document.getElementById('results-section')
  section.innerHTML=''

  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const co = document.getElementById('country')
  const countryID = co.value;
  const country = co.options[co.selectedIndex].getAttribute('data-country')
  const sDate = document.getElementById('start-date').value;
  const eDate = document.getElementById('end-date').value;

  const data = {
    city: city,
    state: state,
    countryID: countryID,
    country: country,
    start: sDate,
    end: eDate
  }
  console.log('form data', data);
  handleSubmit(data)
})

export const handleSubmit = async(data) => {
  try {
    const vData = await Client.validateForm(data)
    if (vData === false) { return }
    else { Client.removeData() }
    const cData = await Client.checkData(data)
    let range = Client.getDateRange(data.start, data.end)
    const coords = await handleGeo(cData)
    console.log('Coords: ', coords)
    if (coords) {
      const note = document.getElementById('note')
      note.classList.remove('invisible')
      const weather = await handleWb(coords, range)
      await Client.processWeather(weather, range)
      await handlePix(cData)
      Client.loadResults()
    }
    // Client.loadResults()
  } catch(e) {
    console.log('handleSubmit error: ', e);
  }
}

const handleGeo = async(loc) => {
  let space = ''
  let cityp
  let statep
  let countryp
  loc.city ? cityp = `&name=${encodeURIComponent(loc.city)}` : cityp = ''
  loc.stateID ? statep = `&adminCode1=${loc.stateID}` : statep = ''
  loc.countryID ? countryp = `&countryCode=${loc.countryID}` : countryp = ''
  let dest = space.concat(cityp, statep, countryp)

  try {
    const response = await fetch('http://localhost:8000/geo', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: dest })
    })
    const data = await response.json()
    if (data === false) {
      alert('So sorry! Your location did not return any results.  Please verify your entries or try a neighboring city');
    }
    console.log('handleGeo data: ', data)
    return data
  } catch(e) {
    console.log('handleGeo error: ', e);
  }
}

const handleWb = async(coords, range) => {
  try {
    const response = await fetch('http://localhost:8000/wb', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coords: coords, range: range })
    })
    const data = await response.json()
    console.log('handleWb Data: ', data)
    return data
  } catch(e) {
    console.log('handleWb error: ', e);
  }
}

const handlePix = async(data) => {
  const dest = {
    city: data.city,
    state: data.state,
    country: data.country
  }
  try {
    const response = await fetch('http://localhost:8000/pix', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dest: dest })
    })
    const pixData = await response.json()
    console.log('pix returned: ', pixData[0].webformatURL)
    if (pixData) { processPix(pixData[0].webformatURL) }
  } catch(e) {
    console.log('handlePix error: ', e);
  }
}

const processPix = async(pix) => {
  try {
    const data = { pixUrl: pix }
    console.log('adding pix: ', data)
    const res = await fetch('http://localhost:8000/add', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const response = await res.json()
  } catch(e) {
    console.log('processPix error: ', e)
  }
}
