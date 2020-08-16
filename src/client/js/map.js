// Create the script tag, set the appropriate attributes
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap`;
script.defer = true;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function() {
  // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

export const getMap = (coords) => {
  let map = new google.maps.Map(document.getElementById('map-div'), {
    center: {lat: coords.lat, lng: coords.long},
    zoom: 8
  })
}
