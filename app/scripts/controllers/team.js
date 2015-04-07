'use strict';

angular.module('nycbaApp')
  .controller('TeamCtrl', function ($scope, $http, $route, $routeParams, $location) {
    $scope.teamId = $routeParams.teamId;
    $scope.currentlyPlaying = false;
    $scope.division = {
    	divisionId: '',
    	name: '',
    	wins: 0,
    	losses: 0,
    	pct: 0,
    	gb: 0,
    	streakLetter: '',
    	streakNumber: 0,
    	currentPlayers: []
    };

    $scope.limitUpcomingGames = 2;
    $scope.noUpcomingGames = false;
    $scope.noPastGames = false;
    $scope.hideBtn = false;
    $scope.upcomingGames = [];
    $scope.captainId = '';

    $http.get('/api/teamById', {params: {teamId: $scope.teamId}})
		.success(function(team) {
			$scope.team = team; 

			$http.get('/api/divisionByTeam', {params: {teamId: $scope.teamId}})
			  .success(function(division){
			  	var division = division;
			  	if (division.length > 0){
			  		$scope.currentlyPlaying = true;
			  		$scope.division.divisionId = division[0].divisionId;
			  		$scope.division.name = division[0].divisionName;
			  		$scope.division.wins = division[0].wins;
			  		$scope.division.losses = division[0].losses;
			  		$scope.division.pct = division[0].pct;
			  		$scope.division.gb = division[0].gb;
			  		$scope.division.streakLetter = division[0].streakLetter;
			  		$scope.division.streakNumber = division[0].streakNumber;
			  		$scope.division.currentPlayers = division[0].currentPlayers;

			  		var currentPlayers = [];

			  		for (var j = 0; j < $scope.division.currentPlayers.length; j++){
			  			currentPlayers.push($scope.division.currentPlayers[j].playerId);
			  			// console.log($scope.division.currentPlayers[j].ppg);
			  			if ($scope.division.currentPlayers[j].isCaptain === true){
			  				$scope.captainId = $scope.division.currentPlayers[j].playerId;
			  			}
			  		}
			  		// console.log('we have ' + currentPlayers.length + ' players')
			  		var updateObject = {
			  			currentPlayers: currentPlayers
			  		};

			  		$http.post('/api/playersByIds', updateObject)
			  		  .success(function(players){
			  		  	//$scope.currentPlayers = players;
			  		  	$scope.currentPlayers = [];
			  		  	for (var j = 0; j < $scope.division.currentPlayers.length; j++){
				  			for (var p = 0; p < players.length; p++){

				  				if ($scope.division.currentPlayers[j].playerId.toString() === players[p]._id.toString()){
				  					$scope.currentPlayers.push({
				  						_id: players[p]._id,
				  						name: players[p].name.first + ' ' + players[p].name.last,
				  						photoUrl: players[p].photoUrl,
				  						ppg: $scope.division.currentPlayers[j].ppg,
				  						apg: $scope.division.currentPlayers[j].apg,
				  						bpg: $scope.division.currentPlayers[j].bpg,
				  						rpg: $scope.division.currentPlayers[j].rpg,
				  						spg: $scope.division.currentPlayers[j].spg
				  					});
				  				}
				  			}
				  		}
			  		  })
			  	}

			  	//if the team is playing in the current season --> display the games
			  	//upcoming games
			  	$http.get('/api/upcomingGamesByTeamId', {params: {teamId: $scope.teamId, divisionId: $scope.division.divisionId}})
			  	  .success(function(games){
			  	  	var games = games;

			  	  	if (games.length > 0){
				  	  	
				  	  	for (var i = 0; i < games.length; i++){
				  	  		$scope.upcomingGames.push({
				  	  			weekNumber: games[i].weekNumber,
				  	  			date: games[i].date,
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
				  	  	$http.get('/api/teamByDivision', {params: {divisionId: $scope.division.divisionId}})
				  	  	  .success(function(teams) {
				  	  	  	var teams = teams;
				  	  	  	for (var i = 0; i < $scope.upcomingGames.length; i++){
				  	  	  		for (var j = 0; j < teams.length; j++){
				  	  	  			if ($scope.upcomingGames[i].team1.index === teams[j].index){
				  	  	  				$scope.upcomingGames[i].team1.teamId = teams[j].teamId;
				  	  	  				$scope.upcomingGames[i].team1.name = teams[j].name;
				  	  	  			}
				  	  	  			else if ($scope.upcomingGames[i].team2.index === teams[j].index){
				  	  	  				$scope.upcomingGames[i].team2.teamId = teams[j].teamId;
				  	  	  				$scope.upcomingGames[i].team2.name = teams[j].name;
				  	  	  			}
				  	  	  		}
				  	  	  	}
				  	  	  });
			  	  	}

			  	  	else{
			  	  		$scope.noUpcomingGames = true;
			  	  	}

			  	  });

			  	//past games
			  	$http.get('/api/pastGamesByTeamId', {params: {teamId: $scope.teamId, divisionId: $scope.division.divisionId}})
			  	  .success(function(games){
			  	  	$scope.pastGames = games;
			  	  	if ($scope.pastGames.length === 0){
			  	  		$scope.noPastGames = true;
			  	  	}
			  	  });

			  });
		})
		.error(function(data) {
			// console.log('Error: ' + data);
		});


	$scope.showAllUpcomingGames = function() {
		$scope.limitUpcomingGames = $scope.upcomingGames.length;
		$scope.hideBtn = true;
	}
  });
