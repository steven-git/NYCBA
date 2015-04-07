'use strict';

angular.module('nycbaApp')
  .controller('DivisionsCtrl', function ($scope, $http) {
    $http.get('/api/divisions')
      .success(function(divisions) {
        $scope.divisions = divisions;
      });
  });
