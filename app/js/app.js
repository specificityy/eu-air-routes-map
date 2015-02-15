define(['angular', 'services/services', 'directives/directives', 'filters/filters', 'controllers/controllers'],

  function(ng) {
    'use strict';

    var app = ng.module('app', ['app.services', 'app.controllers', 'app.filters', 'app.directives', 'ngRoute']);

    app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/map', {
          templateUrl: 'app/partials/map.html',
          controller: 'mapCtrl'
        });

        $routeProvider.otherwise({
          redirectTo: '/map'
        });
      }
    ]);

  });