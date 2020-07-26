export const addCountries = async() => {
  try {
    const countries = await getCountries()
    const country = document.getElementById('country');
    const number = Object.keys(countries).length;
    const select = document.getElementById('country')
    for (let i=0; i<number; i++) {
      const option = document.createElement('option')
      option.className = 'country-option'
      option.value = Object.entries(countries)[i][0]
      option.innerHTML = Object.entries(countries)[i][1]
      select.appendChild(option)
    }
  } catch(e) {
    console.log('Error with addCountries: ', e);
  }
}

const getCountries = async() => {
  try {
    const res = await fetch('http://localhost:8000/getC', {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await res.json()
    return response
  } catch(e) {
    console.log('getCountries error: ', e)
  }
}
