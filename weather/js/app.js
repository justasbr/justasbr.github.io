var app = angular.module("myApp",['ngMap']);

app.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.cnt = 7;
  $scope.lat = 0;
  $scope.lon = 0;
  $scope.zoom = 11;
  $scope.queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+$scope.city+"&mode=json&units=metric&cnt="+$scope.cnt;
  console.log($scope.queryURL);
  $http.get($scope.queryURL).
    success(function(data){
      $scope.weather = data;
    });
  $scope.log = function() {
    console.log("1234");
  }
  $scope.refreshData = function(newCity){
    $scope.queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+$scope.cityInput+"&mode=json&units=metric&cnt="+$scope.cnt;
    $http.get($scope.queryURL).
    success(function(data){
      $scope.weather = data;
      $scope.city = $scope.weather.city.name;
      $scope.lat = $scope.weather.city.coord.lat;
      $scope.lon = $scope.weather.city.coord.lon;
      $scope.placeMarker();
    });
  };
  

  $scope.double = new function(num){
      return 2*num;
  };
  $scope.getDirection = function(deg){
    if (deg <= 45 || deg >= 315){
      return "North";
    }
    else if (deg >= 45 && deg <= 135){
      return "East";
    }
    else if (deg >= 135 && deg <= 225){
      return "South";
    }
    else if (deg >= 225 && deg <= 315){
      return "West";
    }
    return "unknown";
  };
  var marker;
  var map;
  $scope.$on('mapInitialized', function(evt, evtMap) {
    map = evtMap;
    $scope.placeMarker = function() {
      myLatLng = new google.maps.LatLng($scope.lat, $scope.lon);
      if (marker){
        marker.setMap(null); //so only 1 marker at a time
      }
      marker = new google.maps.Marker({position: myLatLng, map: map});
      map.panTo(myLatLng);
    };
    $scope.refreshDataOnLocation = function(e){
    fLat = e.latLng.lat();
    fLng = e.latLng.lng();
    $scope.queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+fLat+"&lon="+fLng+"&mode=json&units=metric&cnt="+$scope.cnt;
    $http.get($scope.queryURL).
    success(function(data){
      $scope.weather = data;
      $scope.city = $scope.weather.city.name;
      $scope.lat = $scope.weather.city.coord.lat;
      $scope.lon = $scope.weather.city.coord.lon;
      $scope.placeMarker();
    });
  };
  });

  
}]);