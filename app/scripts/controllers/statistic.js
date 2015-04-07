'use strict';

angular.module('nycbaApp')
  .controller('StatisticCtrl', function ($scope, $http, $route, $routeParams) {
  	
  	var divisionId = $routeParams.divisionId;
  	$scope.order = '-ppg';
    $scope.selectColumn = '';

  	//get info on division
    $http.get('/api/divisionById', {params: {divisionId: divisionId}})
      .success(function(division) {
        $scope.division = division;
      });

    //get info on players in this division
    $http.get('/api/playersByDivision', {params: {divisionId: divisionId}})
      .success(function(players) {
        $scope.players = players;
      });

     $scope.changeOrder = function(newOrder) {
     	$scope.order = newOrder;
     };

     $scope.selectColumn = function(column) {
       $scope.selectedColumn = column;
     }

     $scope.deselectColumn = function() {
       $scope.selectedColumn = '';
     }

  });
