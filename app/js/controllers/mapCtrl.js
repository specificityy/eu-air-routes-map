define(['controllers/controllers'], function(controllers) {

  return controllers.controller("mapCtrl", function($scope) {
    function init() {

    }


    $scope.searchAirport = function() {
      highlightAirport.call(document.getElementById(document.getElementById('search').value), airportList.filter(function(x) {
        return x.iataCode == document.getElementById('search').value;
      })[0]);
    };


    init();
  });

});