export function validateDest(loc) {
  const zipI = document.getElementById('zip');
  const cityI = document.getElementById('city');
  const stateI = document.getElementById('state');
  const countryI = document.getElementById('country');

  let zip
  if (loc.zip) { zip = validateZip(loc.zip) } else { zip = '' }
  const city = validateLoc(loc.city);
  const state = validateLoc(loc.state);
  const country = loc.country;

  console.log(`results: Zip: ${zip}, City: ${city}, State: ${state}, Country: ${country}`)

  if (!zip && !city && !state && !country) {
    alert('No destination received. Please enter a postal code or location details.')
    return false;
  }
  if (zip && city || zip && state || zip && city || zip && country) {
    alert('Please enter either a postal code OR location details.')
    cityI.value = '';
    stateI.value = '';
    countryI.value = '';
    return false;
  }
  if (!city && !state && !country) {
    return `postalcode=${zip}`
  }
  if (!state && !country) {
    const conf = confirm('Entering only a city may result in a different city being shown. Proceed?')
    return (conf ? `placename=${city}` : false)
  }
  if (!city) {
    return `placename=${state}&country=${country}`
  }
  if (!state) {
    return `placename=${city}&country=${country}`
  }
  else {
    return `placename=${city}+${state}&country=${country}`
  }
}

const validateZip = (zip) => {
  const regex = /^\d{1,5}$/;
  if (regex.test(zip)) { return zip }
  else { alert('Please enter a 5 digit postal code') }
}

const validateLoc = (loc) => { return encodeURIComponent(loc) }

  // const dateI = document.getElementById('date');
