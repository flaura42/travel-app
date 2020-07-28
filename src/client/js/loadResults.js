import { getMap } from './map'

export const loadResults = async() => {
  try {
    const data = await Client.getAll()
    const section = document.getElementById('results-section')

    const h2 = document.createElement('h2')
    h2.innerHTML = 'Travel Plan Details'
    section.append(h2)

    const lDiv = document.createElement('div');
    lDiv.id = 'location-div'
    const h3 = document.createElement('h3')
    h3.className = 'dest-name'

    // Determine what to enter in dest-name
    let text = ''
    let space = ' '
    let comma = ', '
    let city
    let state
    let country

    data.city ? city = data.city : city = ''
    data.state ? state = data.state : state = ''
    data.country ? country = data.country : country = ''

    text = text.concat(city, space, state, comma, country)

    h3.innerText = text
    lDiv.append(h3)

    const tp = document.createElement('p')
    tp.className = 'timezone'
    tp.innerHTML = `<span class="bold">Timezone:</span>  ${data.timezone}`
    lDiv.append(tp)

    const mapDiv = document.createElement('div')
    mapDiv.id = 'map-div'
    lDiv.append(mapDiv)

    const pix = document.createElement('div')
    pix.id = 'pix-div'
    const img = document.createElement('img')
    img.id = 'pix-img'
    if (data.pixUrl) { img.src = data.pixUrl }
    else {
      img.src = 'http://localhost:8080/b798cf65cc50b33b79005263c54b32fd.jpg'
      const pixp = document.createElement('p')
      pixp.innerHTML = 'Sorry, no picture available.  Here is one of a beach!'
      pix.append(pixp)
    }
    pix.append(img)
    lDiv.append(pix)
    section.append(lDiv)

    const coords = { lat: data.lat, long: data.long }
    console.log('coords', coords)
    Client.getMap(coords)

    const div = document.createElement('div')
    div.id = 'results-div'

    const wDiv = document.createElement('div');
    wDiv.id = 'weather-div'
    const h4 = document.createElement('h4')
    if (data.weather.length === 1) {
      h4.innerText = 'Historical Weather (Travel dates outside forecast range)'
    } else {
      h4.innerText = 'Weather Forecast'
    }
    wDiv.append(h4)

    for (let i=0; i<data.weather.length; i++) {
      let fDiv = document.createElement('div')
      if (data.weather.length === 1) {
        fDiv.className = 'historical-div weather-div'
      }
      else {
        fDiv.className = 'forecast-div weather-div'
      }

      let dp = document.createElement('p')
      dp.className = 'fdate-p'
      dp.innerHTML = `<span class="bold">${data.weather[i].date}</span>`
      fDiv.append(dp)

      let maxp = document.createElement('p')
      maxp.className = 'max-p'
      maxp.innerHTML = `<span class="bold">High:</span> ${data.weather[i].high}&#8457`
      fDiv.append(maxp)

      let minp = document.createElement('p')
      minp.className = 'min-p'
      minp.innerHTML = `<span class="bold">Low:</span> ${data.weather[i].low}&#8457`
      fDiv.append(minp)

      // Rain change not available for historical weather
      if (data.weather[i].pop >= 0) {
        let popp = document.createElement('p')
        popp.className = 'pop-p'
        popp.innerHTML = `<span class="bold">Precipitation:</span> ${data.weather[i].pop}%`
        fDiv.append(popp)
      }

      let humip = document.createElement('p')
      humip.className = 'humi-p'
      humip.innerHTML = `<span class="bold">Humidity:</span> ${data.weather[i].humid}%`
      fDiv.append(humip)

      let windp = document.createElement('p')
      windp.className = 'humi-p'
      windp.innerHTML = `<span class="bold">Wind:</span> ${data.weather[i].wind} mph`
      fDiv.append(windp)

      // Icon not available for historical weather
      if (data.weather[i].icon) {
        let icon = document.createElement('img')
        icon.className = 'w-icon'
        icon.src = `https://www.weatherbit.io/static/img/icons/${data.weather[i].icon}.png`
        fDiv.append(icon)
      }
      wDiv.append(fDiv)
      div.append(wDiv)
    }
    section.append(div)

    // Keep at end
    const note = document.getElementById('note')
    note.classList.add('invisible')

    section.classList.remove('invisible')
  } catch(e) {
    console.log('loadResults error: ', e)
  }
}
