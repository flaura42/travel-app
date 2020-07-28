export const addCountries = async() => {
  try {
    const countries = await Client.getCountries()
    const country = document.getElementById('country');
    const number = Object.keys(countries).length;
    const select = document.getElementById('country')
    for (let i=0; i<number; i++) {
      const option = document.createElement('option')
      option.className = 'country-option'
      option.value = Object.entries(countries)[i][0]
      option.setAttribute('data-country', Object.entries(countries)[i][1])
      option.innerHTML = Object.entries(countries)[i][1]
      select.appendChild(option)
    }
  } catch(e) {
    console.log('Error with addCountries: ', e);
  }
}
