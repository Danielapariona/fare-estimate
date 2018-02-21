if (navigator.geolocation) {
  let latitude;
  let longitude;
  function initMap() {
    let localization = (position) => {
      console.log(position.coords);
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      var uluru = {
        lat: latitude,
        lng: longitude
      };
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: uluru
      });
      var marker = new google.maps.Marker({
        position: uluru,
        map: map
      });
    };

    // Autocompletado
    let startLocation = document.getElementById('start-location');
    let endLocation = document.getElementById('end-location');
    new google.maps.places.Autocomplete(startLocation);
    new google.maps.places.Autocomplete(endLocation);





    // Calculando ruta
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    let calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
      directionsService.route({
        origin: startLocation.value,
        destination: endLocation.value,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Tu ruta no se encuentra disponible');
        }
      });
    };
    directionsDisplay.setMap(map);
    let traceRoute = () => {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('get-route').addEventListener('click', traceRoute);
  };
  let error = () => {
    // alert'<p>No se ingresó correctamente la dirección. Busca de nuevo.</p>';
  };




// let error = () => {
//   console.log('<p>No se ingresó correctamente la dirección. Busca de nuevo.</p>');
// };
  navigator.geolocation.getCurrentPosition(localization);
} else {
  alert('Lamentablemente geolocalización no funciona en tu dispositivo');
}