define(['services/services'], function(services) {

  return services.factory("httpHelpersSvc", function($http, $q, configSvc) {
    var svc = {
      getAirports: function() {
        var deferred = $q.defer();

        // $http.get("//ryanair-test.herokuapp.com/api/airports").success(function(data) {
        $http.get("app/js/data/eu-airports.json").success(function(data) {
          if (data && data.length > 0) {
            configSvc.airportList = data;
            deferred.resolve(data);
          } else
            deferred.reject('No data received');
        }).error(function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }
    }

    return svc;
  });
});