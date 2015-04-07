'use strict';

angular.module('nycbaApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
