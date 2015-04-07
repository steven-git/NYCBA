'use strict';

angular.module('nycbaApp')
  .controller('ScoreCtrl', function ($scope, $http, $route, $routeParams) {
  	
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

    
    $http.get('/api/pastGames', {params: {divisionId: divisionId}})
      .success(function(games){
    	
    	$scope.lastWeekGames = games;

    	// var week1 = $scope.lastWeekGames[0].weekNumber + 1;
    	// var week2 = week1 + 1;

    	$http.get('/api/upcomingGames', {params: {divisionId: divisionId}})
	      .success(function(games){
	    	// $scope.upcomingWeeksGames = games;

	    	var games = games;
	  	  	$scope.upcomingWeeksGames = [];
	  	  	for (var i = 0; i < games.length; i++){
	  	  		$scope.upcomingWeeksGames.push({
	  	  			weekNumber: games[i].weekNumber,
	  	  			date: games[i].date,
	  	  			day: games[i].day,
	  	  			timeSlot: games[i].timeSlot,
	  	  			team1: {
	  	  				index: games[i].team1,
	  	  				teamId: '',
	  	  				name: ''
	  	  			},
	  	  			team2: {
	  	  				index: games[i].team2,
	  	  				teamId: '',
	  	  				name: '' 
	  	  			}
	  	  		});
	  	  	}

	  	  	//api call to get teamId/name for indexes
	  	  	$http.get('/api/teamByDivision', {params: {divisionId: divisionId}})
	  	  	  .success(function(teams) {
	  	  	  	var teams = teams;
	  	  	  	// console.log('teams are ' + teams);
	  	  	  	for (var i = 0; i < $scope.upcomingWeeksGames.length; i++){
	  	  	  		for (var j = 0; j < teams.length; j++){
	  	  	  			if ($scope.upcomingWeeksGames[i].team1.index === teams[j].index){
	  	  	  				$scope.upcomingWeeksGames[i].team1.teamId = teams[j].teamId;
	  	  	  				$scope.upcomingWeeksGames[i].team1.name = teams[j].name;
	  	  	  			}
	  	  	  			else if ($scope.upcomingWeeksGames[i].team2.index === teams[j].index){
	  	  	  				$scope.upcomingWeeksGames[i].team2.teamId = teams[j].teamId;
	  	  	  				$scope.upcomingWeeksGames[i].team2.name = teams[j].name;
	  	  	  			}
	  	  	  		}
	  	  	  	}
	  	  	  });
	       });
       
       });

	$scope.selectColumn = function(column) {
       $scope.selectedColumn = column;
     }

     $scope.deselectColumn = function() {
       $scope.selectedColumn = '';
     }


  });
