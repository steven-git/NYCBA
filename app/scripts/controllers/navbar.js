'use strict';

angular.module('nycbaApp')
  .controller('NavbarCtrl', function ($scope, $location, $http, $route) {

    $http.get('/api/divisions')
      .success(function(divisions) {
        $scope.divisions = divisions;
      });
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
