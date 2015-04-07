'use strict';

angular.module('nycbaApp')
  .controller('DivisionCtrl', function ($scope, $http, $route, $routeParams) {
  	
  	var divisionId = $routeParams.divisionId;
  	$scope.order = '-ppg';
    $scope.selectColumn = '';

    $scope.noUpcomingGames = false;

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

    //get info on players in this division
    $http.get('/api/playersByDivision', {params: {divisionId: divisionId}})
      .success(function(players) {
        $scope.playersPhotos = [];
        $scope.players = [];
        // console.log('there are ' + players.length + ' players');
        for (var i = 0; i < players.length; i++){
          $http.get('/api/playerById', {params: {playerId: players[i].playerId}})
            .success(function(player) {
              // console.log('next player ' + player.name.last);
              var newPlayer = {
                playerId: player._id,
                photoUrl: player.photoUrl
              };
              $scope.playersPhotos.push(newPlayer);
              if ($scope.playersPhotos.length === players.length){
                for (var i = 0; i < $scope.playersPhotos.length; i++){
                  for (var j = 0; j < players.length; j++){
                    if ($scope.playersPhotos[i].playerId.toString() === players[j].playerId.toString()){
                      // console.log('found new player: ' + players[j].lastName);
                      $scope.players.push({
                        playerId: $scope.playersPhotos[i].playerId,
                        firstName: players[j].firstName,
                        lastName: players[j].lastName,
                        ppg: players[j].ppg,
                        apg: players[j].apg,
                        rpg: players[j].rpg,
                        spg: players[j].spg,
                        bpg: players[j].bpg,
                        photoUrl: $scope.playersPhotos[i].photoUrl
                      });
                    }
                  }
                }
              }
            });
        }
        //$scope.players = players;
        // for (var i = 0; i < $scope.playersPhotos.length; i++){
        //   for (var j = 0; j < players.length; j++){
        //     if ($scope.playersPhotos[i].playerId.toString() === players[j].playerId.toString()){
        //       console.log('found new player: ' + players[j].name.last);
        //       $scope.players.push({
        //         playerId: $scope.playersPhotos[i].playerId,
        //         firstName: players[j].name.first,
        //         lastName: players[j].name.last,
        //         ppg: players[j].ppg,
        //         apg: players[j].apg,
        //         rpg: players[j].rpg,
        //         spg: players[j].spg,
        //         bpg: players[j].bpg,
        //         photoUrl: $scope.playersPhotos[i].photoUrl
        //       });
        //     }
        //   }
        // }
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


     $http.get('/api/lastWeekGames', {params: {divisionId: divisionId}})
      .success(function(games){
      
      $scope.lastWeekGames = games;

      var week1;
      var week2;

      if ($scope.lastWeekGames.length > 0){
        week1 = $scope.lastWeekGames[0].weekNumber + 1;
      }
      else{
        week1 = 0;
      }

      week2 = week1 + 1;

      if (week1 < 10){
        $http.get('/api/upcomingWeeksGames', {params: {divisionId: divisionId, week1: week1, week2: week2}})
          .success(function(games){
          // $scope.upcomingWeeksGames = games;

          var games = games;
          if (games.length === 0){
            $scope.noUpcomingGames = true;
          }
          else{
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
          } 
        });
        

  });
