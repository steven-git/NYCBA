'use strict';

angular.module('nycbaApp')
  .controller('TeamsCtrl', function ($scope, $http) {
    $http.get('/api/teams')
		.success(function(teams) {
			$scope.teams = teams; 
		});
  });
