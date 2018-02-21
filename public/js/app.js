
const showMap = document.getElementById('map');
let latitude;
let longitude;

if (navigator.geolocation) {
  function initMap() {
    // Función para usar la longitud y latitud
    let localization = (position) => { // retornando longitud y latitud actual
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      // inicio api google maps
      let getPosition = {
        lat: latitude,
        lng: longitude
      };
      var uluru = { lat: latitude,
        lng: longitude };
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: uluru
      });
      var marker = new google.maps.Marker({
        position: uluru,
        map: map
      });

      var address;
      let geocoder = new google.maps.Geocoder;
      let infowindow = new google.maps.InfoWindow;
      geocodeLatLng(geocoder, map, infowindow);

      
      function geocodeLatLng(geocoder, map, infowindow) {
        geocoder.geocode({
          'location': getPosition
        }, function(results, status) {
          if (status === 'OK') {
            console.log(results[0]);
            if (results[0]) {
              map.setZoom(15);
              let marker = new google.maps.Marker({
                position: getPosition,
                map: map,
                // title: 'bicycle marker',
                // icon: 'assets/icon/bike.png'
              });
              startLocation.value = results[0].formatted_address;
              // infowindow.setContent(results[1].formatted_address);
              infowindow.setContent(`<div id='info_window'><span id='geocodedAddress'>${results[0].formatted_address}</span><br><strong>Latitud:</strong> ${getPosition.lat.toFixed(4)} | <strong>Longitud:</strong> ${getPosition.lng.toFixed(4)}</div>`);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }

      // Autocompletado
      let startLocation = document.getElementById('start-location');
      let endLocation = document.getElementById('end-location');
      new google.maps.places.Autocomplete(startLocation);
      new google.maps.places.Autocomplete(endLocation);



      // var geocoder = new google.maps.Geocoder();
      // Calculando ruta
      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;
      let calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
        var address = endLocation.value;
        geocoder.geocode({ 'address': address}, geocodeResult);
        function geocodeResult(results, status) {
          // Verificamos el estatus
          if (status == 'OK') {
              let latDestination = results[0].geometry.location.lat()
              let lngDestination = results[0].geometry.location.lng()
              console.log(latDestination); //latitud del destino
              console.log(lngDestination); // longitud del destino
              console.log(latitude); //latitud de origen
              console.log(longitude);//latitud de destino
              // Api de
              let uberClientId = 'lgw2JdPQEJtjuFid5ujbgmeX8o0ZpmDw';
              let uberServerToken ='ZqX0bbZHfbFGysRiOCYOWgaQcT7xgtDSGL7HF_NJ';
              $.ajax({
                url: 'https://api.uber.com/v1/estimates/price',
                headers: {
                  Authorization: 'Token ' + uberServerToken
                },
                data: {
                  start_latitude: latitude,
                  start_longitude: longitude,
                  end_latitude: latDestination,
                  end_longitude: lngDestination
                },
                success: function(result) {
                  console.log(result);
                }
              });


          } else {
              // En caso de no haber resultados o que haya ocurrido un error
              alert("Geocoding no tuvo éxito debido a: " + status);
          }
      }


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
      showMap.innerHTML = '<p>No se ingresó correctamente la dirección. Busca de nuevo.</p>';
    };
// 

    // function success(pos) {
    //   // var crd = pos.coords;
    //   console.log(pos);
    //   // console.log(crd);
    //   // if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    //   //   console.log('Congratulation, you reach the target');
    //   //   navigator.geolocation.clearWatch(id);
    //   // }
    // };


    navigator.geolocation.getCurrentPosition(localization, error);

    // navigator.geolocation.watchPosition(success);
  }
} 