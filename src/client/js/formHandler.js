const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const zip = document.getElementById('zip');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const country = document.getElementById('country');
  const date = document.getElementById('date');

  if (zip.value && city.value || zip.value && country.value) {
    alert('Please enter either a postalcode OR a city/country.')
    city.value = '';
    state.value = '';
    country.value = '';
  } else if (!zip.value && !country.value) {
    const conf = confirm('Entering only a city may result in a different city being shown. Proceed?')
    if (conf) {
      handleSubmit(zip.value, city.value, state.value, country.value, date.value);
    }
  } else {
    handleSubmit(zip.value, city.value, state.value, country.value, date.value);
  }
})

export const handleSubmit = async(zip, city, state, country, date) => {
  console.log(`Zip: ${zip}, City: ${city}, State: ${state}, Country: ${country}`);

  const vlocation = `postalcode=${zip}&placename=${city}+${state}&country=US`

  // const place = encodeURIComponent(location)
  // console.log('encoded: ', place)
  const response = await fetch('http://localhost:8000/geo', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      destination: vlocation
    })
  })
  try {
    const data = await response.json()
    if (!data.coords) {
      alert('So sorry! Your location did not return any results.  Please try a neighboring city');
    }
    console.log('handleSubmit Data: ', data)
  } catch(e) {
    console.log('handleSubmit error: ', e);
  }
}
