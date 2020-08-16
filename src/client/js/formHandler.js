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
    country: country,
    countryID: countryID,
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
    if (!cData) {
      console.log('no data')
      return
    }
    let range = await Client.getDateRange(data.start, data.end)
    const coords = await handleGeo(cData)
    if (!coords) {
      console.log('no coords')
      return
    }
    const note = document.getElementById('note')
    note.classList.remove('invisible')
    const weather = await handleWb(coords, range)
    const wCheck = await Client.processWeather(weather, range)

    if (!wCheck) {
      console.log('bad weather')
      return
    }
    const pCheck =  await handlePix()
    if (!pCheck) {
      console.log('bad pix')
      return
    }
    Client.loadResults()
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
    console.error('handleGeo error: ', e);
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
    console.error('handleWb error: ', e);
  }
}

const handlePix = async() => {
  let data = await Client.getAll()
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
    if (pixData) {
      const pCheck = await Client.addData({pixUrl: pixData[0].webformatURL})
      return pCheck
    }
    else { return true }
  } catch(e) {
    console.error('handlePix error: ', e);
  }
}
