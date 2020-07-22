export function validateDest(zip, city, state, country) {
  const zipI = document.getElementById('zip');
  const cityI = document.getElementById('city');
  const stateI = document.getElementById('state');
  const countryI = document.getElementById('country');

  console.log(`results: Zip: ${zip}, City: ${city}, State: ${state}, Country: ${country}`)

  if (!zip && !city && !state && !country) {
    alert('No destination received. Please enter a postal code or location details.')
  }
   else if (zip && city || zip && state || zip && country) {
    alert('Please enter either a postal code OR location details.')
    cityI.value = '';
    stateI.value = '';
    countryI.value = '';
  }
  else if (!zip && !state && !country) {
    const conf = confirm('Entering only a city may result in a different city being shown. Proceed?')
    if (conf) {
      console.log('proceeding');
      validateLoc(city);
    }
  }
  else if (!city && !state && !country) {
    console.log('validating zip');
    validateZip(zip)
  }
  else {
    console.log('validating loc');
    validateLoc(city, state, country);
  }
}

const validateZip = (zip) => {
  const regex = /^\d{1,5}$/;
  if (regex.test(zip)) {
    console.log('zip test passed');
    const loc = `postalcode=${zip}`
    console.log('loc: ', loc);
    Client.handleSubmit(loc);
  }
  else {
    alert('Please enter a 5 digit postal code')
  }
}

const validateLoc = (city, state, country) => {
  const vCity = encodeURIComponent(city);
  const vState = encodeURIComponent(state);
  if (!city) {
    const loc = `placename=${vState}&country=${country}`
    console.log('loc: ', loc);
    Client.handleSubmit(loc);
  }
  if (!state) {
    const loc = `placename=${vCity}&country=${country}`
    console.log('loc: ', loc);
    Client.handleSubmit(loc);
  }
  else {
    const loc = `placename=${vCity}+${vState}&country=${country}`
    console.log('loc: ', loc);
    Client.handleSubmit(loc);
  }
}


  // const dateI = document.getElementById('date');
