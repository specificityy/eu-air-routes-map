require.config({
  baseUrl: 'app/js',
  paths: {
    angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular.min',
    ngAnimate: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-animate.min',
    ngResource: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-resource.min',
    ngRoute: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-route.min',
    ngSanitize: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-sanitize.min',
    ngTouch: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-touch.min',
    // d3: 'http://d3js.org/d3.v3',
    // topojson: 'http://d3js.org/topojson.v1',
    app: 'app'
  },
  shim: {
    angular: {
      exports: 'angular',
      // deps: ['topojson', 'd3.global']
    },
    ngAnimate: {
      exports: 'ngAnimate',
      deps: ['angular']
    },
    ngResource: {
      exports: 'ngResource',
      deps: ['angular']
    },
    ngRoute: {
      exports: 'ngRoute',
      deps: ['angular']
    },
    ngSanitize: {
      exports: 'ngSanitize',
      deps: ['angular']
    },
    ngTouch: {
      exports: 'ngTouch',
      deps: ['angular']
    }

    // topojson: {
    //   exports: 'topojson',
    //   deps: ['d3.global']
    // }
  }
});

// define("d3.global", ["d3"], function(_) {
//   window.d3 = _;
//   console.log(_);
// });

require(
  [
    // Dependencies from lib
    'angular',
    'ngRoute',
    'ngSanitize',

    // Angular directives/controllers/services
    'app',
    'services/services',
    'directives/directives',
    'filters/filters',
    'controllers/controllers',
    'controllers/mapCtrl',
    'services/arrangeLabelsSvc',
    'services/mapZoomSvc',
    'services/configSvc',
    'services/highlightAirportSvc',
    'services/mapHelpersSvc',
    'services/httpHelpersSvc',
    'directives/eu-route-map',
    'directives/auto-complete'
  ],
  function(angular) {
    angular.bootstrap(document, ['app']);
  }
);