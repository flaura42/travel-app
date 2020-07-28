export const validateForm = (data) => {
  if (!data.city && !data.state && !data.countryID) {
    alert('No destination received. Please enter your travel details.')
    return false;
  }

  if (!data.state && !data.countryID) {
    const conf = confirm('Entering only a city may result in a different city being shown. Proceed?')
    if (!conf) { return false }
  }

// https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript/49178339
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/;
  if (!regex.test(data.start)) {
    alert('Please enter a valid departure date in MM/DD/YYYY format.')
    return false
  };
  if (!regex.test(data.end)) {
    alert('Please enter a valid return date in MM/DD/YYYY format.')
    return false
  };

  let start = Date.parse(data.start)
  let end = Date.parse(data.end)
  let range = end - start
  if (range < 0) {
    alert('Are you returning before you leave?')
    return false
  }
  return true
}
