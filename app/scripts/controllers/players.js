'use strict';

angular.module('nycbaApp')
  .controller('PlayersCtrl', function ($scope, $http, $routeParams, $location) {
    $http.get('/api/players')
		.success(function(players) {
			$scope.players = players;
		});
  });
