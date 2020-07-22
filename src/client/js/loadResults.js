export const loadResults = async() => {
  try {
    const res = await fetch('http://localhost:8000/all', {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await res.json();
  console.log('Data to fill: ', data)
  fillPage(data)
  } catch(e) {
    console.log('loadResults error: ', e)
  }
}


const section = document.getElementById('results-section')
const div = document.getElementById('results-div')

const fillPage = (data) => {
  const lDiv = document.createElement('div');
  lDiv.id = 'location-div'
  const h4 = document.createElement('h4')
  h4.innerText = `${data.city}, ${data.state}, ${data.country}`
  lDiv.append(h4)

  const tp = document.createElement('p')
  tp.innerText = `Timezone: ${data.timezone}`
  lDiv.append(tp)

  div.append(lDiv)
  section.classList.remove('invisible')

  // const wDiv = document.createElement('div');
  // wDiv.id = 'weather-div'

}
