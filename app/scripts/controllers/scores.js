'use strict';

angular.module('nycbaApp')
  .controller('ScoresCtrl', function ($scope, $http) {
    $http.get('/api/divisions')
      .success(function(divisions) {
        $scope.divisions = divisions;
      });
  });
