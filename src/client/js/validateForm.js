export const validateDest = async(loc) => {
  try {
    let city = validateLoc(loc.city);
    let state = validateLoc(loc.state);
    let country = loc.country;

    console.log(`results: City: ${city}, State: ${state}, Country: ${country}`)

    if (!city && !state && !country) {
      alert('No destination received. Please enter a postal code or location details.')
      return false;
    }

    if (!state && !country) {
      const conf = confirm('Entering only a city may result in a different city being shown. Proceed?')
      return (conf ? `name=${city}` : false)
    }

    if (state.length === 2) {
      const states = await Client.getStates()
      state = Object.getOwnPropertyDescriptor(states, state).value
    }

    let space = ''
    let cityp
    let statep
    let countryp
    city ? cityp = `&name=${city}` : cityp = ''
    state ? statep = `&adminName1=${state}` : statep = ''
    country ? countryp = `&country=${country}` : countryp = ''

    let dest = space.concat(cityp, statep, countryp)
    console.log('destination', dest)
    return dest
  } catch(e) {
    console.log('validateDest error', e)
  }
}

const validateLoc = (loc) => { return encodeURIComponent(loc) }

// https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript/49178339
export const validateDates = (start, end) => {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/;
  if (!regex.test(start)) {
    alert('Please enter a valid departure date in MM/DD/YYYY format.')
    return false
  };
  if (!regex.test(end)) {
    alert('Please enter a valid return date in MM/DD/YYYY format.')
    return false
  };

  start = Date.parse(start)
  end = Date.parse(end)
  const range = end - start
  if (range < 0) {
    alert('Are you returning before you leave?')
    return false
  }
  return true
}
