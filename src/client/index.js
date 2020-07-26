import { handleSubmit } from './js/formHandler'
import { validateDest } from './js/validateForm'
import { validateDates } from './js/validateForm'
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

export {
  handleSubmit,
  validateDest,
  validateDates,
  getDateRange,
  getMap,
  addCountries,
  loadResults
}
