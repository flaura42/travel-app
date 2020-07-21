const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zip = document.getElementById('zip').value;
  const country = document.getElementById('country').value;
  const date = document.getElementById('date').value;
  handleSubmit(city);
})

export const handleSubmit = async(location) => {
  const place = encodeURIComponent(location)
  console.log('encoded: ', place)
  const response = await fetch('http://localhost:8000/geo', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      placename: place
    })
  })
  try {
    const data = await response.json()
    console.log('handleSubmit Data: ', data)
  } catch(e) {
    console.log('handleSubmit error: ', e);
  }
}
