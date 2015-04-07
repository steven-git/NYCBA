'use strict';

angular.module('nycbaApp')
  .controller('StandingCtrl', function ($scope, $http, $route, $routeParams) {
  	
  	var divisionId = $routeParams.divisionId;
  	$scope.order = '-ppg';
    $scope.selectColumn = '';

  	//get info on division
    $http.get('/api/divisionById', {params: {divisionId: divisionId}})
      .success(function(division) {
        $scope.division = division;
      });

    //get info on teams in this division
    $http.get('/api/teamByDivision', {params: {divisionId: divisionId}})
      .success(function(teams) {
        $scope.teams = teams;
      });

    $scope.selectColumn = function(column) {
       $scope.selectedColumn = column;
     }

     $scope.deselectColumn = function() {
       $scope.selectedColumn = '';
     }

  });
