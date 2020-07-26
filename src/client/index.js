import { handleSubmit } from './js/formHandler'
import { addData, checkData, processWeather } from './js/handleData'
import { validateDest, validateDates } from './js/validateForm'
import { addCountries } from './js/addCountries'
import { loadResults } from './js/loadResults'
import { getDateRange } from './js/getDateRange'
import { getMap } from './js/map'

import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/results.scss'

document.addEventListener('DOMContentLoaded', () => {
  Client.addCountries()
});


const getAll = async() => {
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
  return data
  } catch(e) {
    console.log('getAll error: ', e)
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

const getStates = async() => {
  try {
    const res = await fetch('http://localhost:8000/getS', {
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
    console.log('getStates error: ', e)
  }
}

export {
  handleSubmit,
  addData,
  checkData,
  processWeather,
  validateDest,
  validateDates,
  getDateRange,
  getMap,
  addCountries,
  getAll,
  getCountries,
  getStates,
  loadResults
}
