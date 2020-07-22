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
    handleGeo(vLoc)
  } catch(e) {
    console.log('Error with handleSubmit: ', e);
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
    if (!data.coords) {
      alert('So sorry! Your location did not return any results.  Please verify your entries or try a neighboring city');
    }
    console.log('handleSubmit Data: ', data)
  } catch(e) {
    console.log('handleSubmit error: ', e);
  }
}
