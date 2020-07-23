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
  const h3 = document.createElement('h3')
  h3.innerText = `${data.city}, ${data.state}, ${data.country}`
  lDiv.append(h3)

  const tp = document.createElement('p')
  tp.innerHTML = `<span class="bold">Timezone:</span> ${data.timezone}`
  lDiv.append(tp)
  div.append(lDiv)

  const wDiv = document.createElement('div');
  wDiv.id = 'weather-div'
  const h4 = document.createElement('h4')
  h4.innerText = 'Weather Forecast'
  wDiv.append(h4)

  for (let i=0; i<data.weather.length; i++) {
    let fDiv = document.createElement('div')
    fDiv.className = 'forecast-div'

    let dp = document.createElement('p')
    dp.className = 'fdate-p'
    dp.innerHTML = `<span class="bold">Forecast for:</span> ${data.weather[i].date}`
    fDiv.append(dp)

    let maxp = document.createElement('p')
    maxp.className = 'max-p'
    maxp.innerHTML = `<span class="bold">High:</span> ${data.weather[i].high}&#8457`
    fDiv.append(maxp)

    let minp = document.createElement('p')
    minp.className = 'min-p'
    minp.innerHTML = `<span class="bold">Low:</span> ${data.weather[i].low}&#8457`
    fDiv.append(minp)

    let popp = document.createElement('p')
    popp.className = 'pop-p'
    popp.innerHTML = `<span class="bold">Rain Chance:</span> ${data.weather[i].pop}%`
    fDiv.append(popp)

    let humip = document.createElement('p')
    humip.className = 'humi-p'
    humip.innerHTML = `<span class="bold">Humidity:</span> ${data.weather[i].humid}%`
    fDiv.append(humip)

    let icon = document.createElement('img')
    icon.className = 'w-icon'
    icon.src = `https://www.weatherbit.io/static/img/icons/${data.weather[i].icon}.png`
    fDiv.append(icon)

    wDiv.append(fDiv)
    div.append(wDiv)
  }

  // Keep at end
  section.classList.remove('invisible')

}
