define(['angular', 'controllers/controllers'], function(angular, controllers) {

  return controllers.controller("mapCtrl", function($scope, configSvc, highlightAirportSvc) {
    function init() {
      $scope.vm = {};
    }


    $scope.$on('airportsLoaded', function() {
      $scope.airports = [];

      angular.forEach(configSvc.airportList, function(item) {
        $scope.airports.push({
          name: item.name,
          iataCode: item.iataCode,
          country: item.country.englishSeoName
        });
      });

      $scope.airportsLoaded = true;
      $scope.$apply();
    });

    $scope.searchAirport = function() {
      var poi = document.getElementById($scope.vm.search);

      if (poi == null) return;

      highlightAirportSvc.highlightAirport.call(poi, configSvc.airportList.filter(function(x) {
        return x.iataCode == $scope.vm.search;
      })[0]);
    };


    $scope.checkAirport = function(ev) {
      if (ev.keyCode !== 13) return;

      var keepGoing = true,
        result;
      angular.forEach(configSvc.airportList, function(item, key) {
        if (keepGoing) {

          if (item.iataCode.toLowerCase() === $scope.vm.search || item.name.toLowerCase() === $scope.vm.search) {
            result = item.iataCode;
            keepGoing = false;

          } else {
            console.log($scope.vm.search);
            var check = new RegExp($scope.vm.search, 'i');
            if (check.test(item.iataCode) || check.test(item.name)) {
              result = item.iataCode;
            }
          }

        }

      });

      $scope.vm.search = result;
      $scope.searchAirport();
    }


    init();
  });

});