define(['angular', 'services/services', 'directives/directives', 'filters/filters', 'controllers/controllers'],

  function(angular) {
    'use strict';
    angular.module('app', ['app.services', 'app.controllers', 'app.filters', 'app.directives']);
  });