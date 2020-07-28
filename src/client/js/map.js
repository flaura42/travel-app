// Create the script tag, set the appropriate attributes
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD23ufd4tRGJDvE5cwVU6FahfbJfn9zBWM&callback=initMap`;
script.defer = true;
script.async = true;

document.head.appendChild(script);

export const getMap = (coords) => {
  let map = new google.maps.Map(document.getElementById('map-div'), {
    center: {lat: coords.lat, lng: coords.long},
    zoom: 8
  })
}
