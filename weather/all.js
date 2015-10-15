var app = angular.module("weatherApp", ['uiGmapgoogle-maps']);

app.controller('MainController', function ($scope, $http, $document, uiGmapGoogleMapApi, uiGmapIsReady, $timeout, $window) {
  var main = this;
  var marker, map, mapElement, myLatLng;
  var API_INFO = "&appid=8653d4d06dc72063c521dc7221b81aa6";
  var isMapLarge = true;
  this.showMap = false;
  this.count = 7;

  $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 11, events: {click: getClickedLocation}};

  function getClickedLocation(map, event, data) {
    //disabled since not working (API changed)
	//getDataByLocation(data[0].latLng.H, data[0].latLng.L);
  }

  $scope.getDirection = function (deg) {
    if (deg <= 45 || deg >= 315) {
      return "North";
    }
    else if (deg >= 45 && deg <= 135) {
      return "East";
    }
    else if (deg >= 135 && deg <= 225) {
      return "South";
    }
    else if (deg >= 225 && deg <= 315) {
      return "West";
    }
  };

  this.changeMapSize = function () {

    var multiplier = isMapLarge ? 0.28 : 0.7;
    isMapLarge = !isMapLarge;

    var newHeight = parseInt($window.outerHeight * multiplier);
    mapElement.css('height', newHeight + 'px');

    $timeout(function () {
      google.maps.event.trigger(map, "resize");
      map.panTo(myLatLng);
    }, 400);
  };

  function placeMarker() {
    if (map) {
      myLatLng = new google.maps.LatLng($scope.lat, $scope.lon);
      if (marker) {
        marker.setMap(null); //removes previous marker from the map
      }
      marker = new google.maps.Marker({position: myLatLng, map: map});
      map.panTo(myLatLng);
    }
  }

  uiGmapGoogleMapApi.then(getLocation);

  uiGmapIsReady.promise(1).then(function (instances) {
    console.log('isReady');
    instances.forEach(function (inst) {
      map = inst.map;
      mapElement = angular.element(document.getElementsByClassName('angular-google-map-container')[0]);
      main.changeMapSize();
      placeMarker();
    });
  });

  function getDataByLocation(lat, lng) {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" +
      lat + "&lon=" + lng + "&mode=json&units=metric&cnt=" + main.count + API_INFO;
    $http.get(queryURL).then(function (data) {
      main.showMap = true;
      $scope.weather = data.data;
      $scope.city = $scope.weather.city.name;
      $scope.lat = $scope.weather.city.coord.lat;
      $scope.lon = $scope.weather.city.coord.lon;
      placeMarker();
    });
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        getDataByLocation(pos.coords.latitude, pos.coords.longitude);
      }, function () {
        console.log("Could not get user's location");
      });
    }
  }

  this.getDataByCityName = function () {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +
      main.cityInput + "&mode=json&units=metric&cnt=" + main.count + API_INFO;
    $http.get(queryURL).then(function (data) {
      main.showMap = true;
      $scope.weather = data.data;
      $scope.city = $scope.weather.city.name;
      $scope.lat = $scope.weather.city.coord.lat;
      $scope.lon = $scope.weather.city.coord.lon;
      placeMarker();
    });
  };

});