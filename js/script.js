// Api documentation found here https://geocoder.opencagedata.com/api
// We're doing reverse

// I've generated a key so you can start right away
var api_key = '614bd81902a73f0d3f6db088fdab4f68'; 

// The end point is the url you request to get data
var endpoint = 'http://api.opencagedata.com/geocode/v1/json?q=';

// The full url will be constructed like this
// http://api.opencagedata.com/geocode/v1/json?q=PLACENAME&key=YOUR-API-KEY

function findLocation(){
	var query = $('#location').val();


	//The query needs to be encoded for URLs - ie replaces spaces with %20's
 	var encodedQuery = encodeURIComponent(query);

 	// Now we can construct the url
	var url = endpoint + encodedQuery + '&key=' + api_key;
	// https://api.opencagedata.com/geocode/v1/json?q=Wellington,+New%20Zealand&key=614bd81902a73f0d3f6db088fdab4f68&pretty=1
	// It should look like that - try opening that in your browser

	// Now we can use Jquery to make a GET request
	$.get(url, function(data) {
		// Check your browser javascript console to look through the data
		console.log(data);

		$('#address').text('Address: ' + data.results[0].formatted);
		var lat= data.results[0].geometry.lat;

		$('#lat').text('Lattitude: ' + lat);

		var lng= data.results[0].geometry.lng;
		$('#lng').text('Longitude: ' + data.results[0].geometry.lng);
		$('#civil').text('Sunrise: ' + data.results[0].annotations.sun.rise.civil);
		$('#civilsunset').text('Sunset: ' + data.results[0].annotations.sun.set.civil);
		$('#callingcode').text('Calling Code: ' + data.results[0].annotations.callingcode);


		var Sunrise = convertTimestamp(data.results[0].annotations.sun.rise.civil)
		$('#civil').text('Sunrise: ' + Sunrise);


		var Sunset = convertTimestamp(data.results[0].annotations.sun.set.civil)
		$('#civilsunset').text('Sunset: ' + Sunset);

		initMap(lat, lng);


	});
}


function convertTimestamp(timestamp) {
	  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
			yyyy = d.getFullYear(),
			mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
			dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
			hh = d.getHours(),
			h = hh,
			min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
			ampm = 'AM',
			time;

		if (hh > 12) {
			h = hh - 12;
			ampm = 'PM';
		} else if (hh === 12) {
			h = 12;
			ampm = 'PM';
		} else if (hh == 0) {
			h = 12;
		}

		// ie: 2013-02-18, 8:35 AM
		time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

		return time;
}


  
      function initMap(lat, lng) {
           var mapCanvas = document.getElementById('map');
           var mapOptions = {
           	center: new google.maps.LatLng(lat,lng),
           	zoom: 12
           };


           var map = new google.maps.Map(mapCanvas, mapOptions);


           var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
    
           
        }


document.getElementById("location")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("button1").click();
    }
});

/* TODO 

Also display longitude
Allow users to enter their own query in the text box
General Styling

-- Bonus for experts
Display the sunrise and sunset times - note that it's returned as a UNIX timestamp, 
it will need to be converted to human readable time

Use the google maps api to insert an embeded map of the location

*/