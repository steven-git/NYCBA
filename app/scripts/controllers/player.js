'use strict';

angular.module('nycbaApp')
  .controller('PlayerCtrl', function ($scope, $http, $routeParams, $location) {

    $scope.playerId = $routeParams.playerId;

    $scope.isCurrentlyPlaying = false;

    $scope.team = {
    	teamId: '',
    	teamName: '',
    	ppg: 0,
    	rpg: 0,
    	apg: 0,
    	spg: 0,
    	bpg: 0
    };

    $http.get('/api/playerById', {params: {playerId: $scope.playerId}})
		.success(function(player) {

			$scope.player = player;

			$http.get('/api/teamByPlayer', {params: {playerId: $scope.playerId}})
			  .success(function(team){
			  	var team = team;
			  	if (team.length > 0){
			  		$scope.isCurrentlyPlaying = true;
			  		$scope.team.teamId = team[0].teamId;
			  		$scope.team.teamName = team[0].teamName;
			  		$scope.team.ppg = team[0].ppg;
			  		$scope.team.rpg = team[0].rpg;
			  		$scope.team.apg = team[0].apg;
			  		$scope.team.spg = team[0].spg;
			  		$scope.team.bpg = team[0].bpg;
			  	}
			  	else{
			  		$scope.team.teamId = 0;
			  	}

			  	// console.log($scope.player);

				$http.get('/api/randomPlayers', {params: {teamId: $scope.team.teamId, playerId: $scope.playerId}})
				  .success(function(random){
				  	// console.log('random ' + random);
				  	$scope.randomPlayers = random;
				  });
			  });

		})
		.error(function(data) {
			// console.log('Error: ' + data);
		});

  });
