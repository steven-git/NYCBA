'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    Player = mongoose.model('Player'),
    Team = mongoose.model('Team'),
    Info = mongoose.model('Info'),
    Season = mongoose.model('Season'),
    Division = mongoose.model('Division'),
    Game = mongoose.model('Game');

/**
 * Get current divisions
 */
exports.getCurrentDivisions = function(req, res) {
  Season.find({'status': 1}, function(err, season) {
    if (err)
      res.send(err);
    if (season.length !== 0){
      Division.find({'seasonId': mongoose.Types.ObjectId(season[0]._id)}, function(err, divisions){
        if (err)
          return res.send(err);
        return res.json(divisions)
      });
    }
  });
};


exports.getDivisionById = function(req, res) {
  var divisionId = req.query.divisionId;
  Division.findOne({'_id': mongoose.Types.ObjectId(divisionId)}, function(err, division) {
    if (err)
      return res.send(err);
    return res.json(division);
  });
};


exports.getTeamByDivision = function(req, res) {
  var divisionId = req.query.divisionId;
  Division.aggregate({'$match': {'_id': mongoose.Types.ObjectId(divisionId)}}) 
                      .unwind('teams')
                      .project({
                        teamId: '$teams.teamId',
                        name: '$teams.name',
                        index: '$teams.index',
                        wins: '$teams.wins',
                        losses: '$teams.losses',
                        gb: '$teams.gb',
                        pct: '$teams.pct',
                        streakLetter: '$teams.streak.letter',
                        streakNumber: '$teams.streak.number'
                      })
                      .exec(function(err, teams){
                        if (err)
                          return res.send(err);
                        return res.json(teams)
                      });
};


exports.getPlayersByDivision = function(req, res) {
  var divisionId = req.query.divisionId;
  Division.aggregate({'$match': {'_id': mongoose.Types.ObjectId(divisionId)}}) 
                      .unwind('teams')
                      .project({
                        players: '$teams.players'
                      })
                      .unwind('players')
                      .project({
                        playerId: '$players.playerId',
                        firstName: '$players.name.first',
                        lastName: '$players.name.last',
                        ppg: '$players.ppg',
                        apg: '$players.apg',
                        rpg: '$players.rpg',
                        spg: '$players.spg',
                        bpg: '$players.bpg'
                      })
                      .exec(function(err, players){
                        if (err)
                          return res.send(err);
                        return res.json(players)
                      });
};


exports.getPlayers = function(req, res) {
  Player.find({}, function(err, players) {
    if (err)
      return res.send(err);
    return res.json(players);
  });
};


exports.getPlayerById = function(req, res) {
  var playerId = req.query.playerId;
  Player.findOne({'_id': mongoose.Types.ObjectId(playerId)}, function(err, player) {
    if (err)
      return res.send(err);
    return res.json(player);
  });
};


exports.getTeamByPlayer = function(req, res) {
  var playerId = req.query.playerId;
  Season.find({'status': 1}, function(err, season) {
    if (err)
      res.send(err);
    if (season.length !== 0){
      Division.aggregate({'$match': {'seasonId': mongoose.Types.ObjectId(season[0]._id)}}) 
            .unwind('teams')
            .project({
              teamId: '$teams.teamId',
              teamName: '$teams.name',
              players: '$teams.players'
            })
            .unwind('players')
            .match({'players.playerId': mongoose.Types.ObjectId(playerId)})
            .project({
              teamId: '$teamId',
              teamName: '$teamName',
              ppg: '$players.ppg',
              rpg: '$players.rpg',
              apg: '$players.apg',
              spg: '$players.spg',
              bpg: '$players.bpg'
            })
            .exec(function(err, playerInfo){
                    if (err)
                      return res.send(err);
                    return res.json(playerInfo);
                  });
    }
    else{
      return res.send({});
    }
  });
};


exports.getTeams = function(req, res) {
  Team.find({}, function(err, teams) {
    if (err)
      return res.send(err);
    return res.json(teams);
  });
};


exports.getTeamById = function(req, res) {
  var teamId = req.query.teamId;
  Team.findOne({'_id': mongoose.Types.ObjectId(teamId)}, function(err, team) {
    if (err)
      return res.send(err);
    return res.json(team);
  });
};


exports.getDivisionByTeam = function(req, res) {
  var teamId = req.query.teamId;
  // console.log('team id is ' + teamId);
  Season.find({'status': 1}, function(err, season) {
    if (err)
      res.send(err);

    if (season.length !== 0){
      Division.aggregate({'$match': {'seasonId': mongoose.Types.ObjectId(season[0]._id)}}) 
            .unwind('teams')
            .project({
              divisionId: '$_id',
              divisionName: '$name',
              teamId: '$teams.teamId',
              wins: '$teams.wins',
              losses: '$teams.losses',
              gb: '$teams.gb',
              pct: '$teams.pct',
              streakLetter: '$teams.streak.letter',
              streakNumber: '$teams.streak.number',
              currentPlayers: '$teams.players'
            })
            .match({teamId: mongoose.Types.ObjectId(teamId)})
            .exec(function(err, teamInfo){
                    if (err)
                      return res.send(err);
                    // console.log(teamInfo);
                    return res.json(teamInfo);
                  });
      }
      else{
        return res.send({});
      }

  });
};


exports.getPastGamesByTeamId = function(req, res) {
  var teamId = req.query.teamId;
  var divisionId = req.query.divisionId;
  Game.find({'divisionId': mongoose.Types.ObjectId(divisionId), 
            '$or': [
              {'team1Scores.teamId': mongoose.Types.ObjectId(teamId)},
              {'team2Scores.teamId': mongoose.Types.ObjectId(teamId)}
            ]}, function(err, games) {
    if (err)
      return res.send(err);
    return res.json(games);
  });
};


exports.getUpcomingGamesByTeamId = function(req, res) {
  var teamId = req.query.teamId;
  var divisionId = req.query.divisionId;
  Division.aggregate({'$match': {'_id': mongoose.Types.ObjectId(divisionId)}}) 
              .unwind('teams')
              .project({
                teamId: '$teams.teamId',
                index: '$teams.index'
              })
              .match({teamId: mongoose.Types.ObjectId(teamId)})
              .exec(function(err, teamInfo){
                      if (err)
                        return res.send(err);
                      var index = teamInfo[0].index;
                      console.log('index is ' + index);
                      Game.find({'divisionId': mongoose.Types.ObjectId(divisionId),
                                'isPlayed': false,
                                '$or': [
                                  {'team1': index},
                                  {'team2': index}
                                ]}, function(err, games){
                                  if (err)
                                    return res.send(err);
                                  //console.log('upcoming games are ' + games);
                                  return res.json(games);
                                });
                    });
};


exports.getLastWeekGames = function(req, res) {
  var divisionId = req.query.divisionId;
  Game.find({'divisionId': mongoose.Types.ObjectId(divisionId), 'isPlayed': true}, function(err, games){
    if (err)
      return res.send(err);
    if (games.length > 0){
      Game.aggregate({'$match': {'divisionId': mongoose.Types.ObjectId(divisionId), 'isPlayed': true}}) 
              .sort('-weekNumber')
              .limit(1)
              .exec(function(err, maxWeek){
                      if (err)
                        return res.send(err);
                      var maxWeek = maxWeek[0].weekNumber;
                      console.log('maxWeek is ' + maxWeek);
                      Game.find({'divisionId': mongoose.Types.ObjectId(divisionId), 'weekNumber': maxWeek}, function(err, games){
                        if (err)
                          return res.send(err);
                        console.log('past weeks games are ' + games);
                        return res.json(games);
                      });
                    });
    }
    else
    {
      return res.send([]);
    }
  });
  
};


exports.getUpcomingWeeksGames = function(req, res) {
  var divisionId = req.query.divisionId;
  var week1 = req.query.week1;
  var week2 = req.query.week2;
  Game.find({'divisionId': mongoose.Types.ObjectId(divisionId), 
            '$or': [
              {'weekNumber': week1},
              {'weekNumber': week2}
            ]}, function(err, games) {
    if (err)
      return res.send(err);
    return res.json(games);
  });
};


exports.getPastGames = function(req, res) {
  var divisionId = req.query.divisionId;
  Game.find({'divisionId': mongoose.Types.ObjectId(divisionId), 'isPlayed': true}, function(err, games){
    if (err)
      return res.send(err);
    return res.json(games);
  });
};


exports.getUpcomingGames = function(req, res) {
  var divisionId = req.query.divisionId;
  Game.find({'divisionId': mongoose.Types.ObjectId(divisionId), 'isPlayed': false}, function(err, games){
    if (err)
      return res.send(err);
    return res.json(games);
  });
};


exports.playersByIds = function(req, res) {
  //console.log('req.body.currentPlayers are ' + req.body.currentPlayers);
  var playersIds = req.body.currentPlayers;
  console.log('got ' + playersIds.length + ' players');
  var found = 0;
  var players = [];
  for (var i = 0; i < playersIds.length; i++){
    console.log('playersIds[i]' + playersIds[i]);
    Player.findOne({'_id': mongoose.Types.ObjectId(playersIds[i])}, function(err, player) {
      if (err)
        return res.send(err);
      console.log(player);
      players.push(player);
      if (++found === playersIds.length){
        return res.json(players);
      }
    });
  }
};


exports.sendSignUpMail = function(req, res){
  var nodemailer = require("nodemailer");

  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "nycba.league@gmail.com",
          pass: "dchampizhere2432"
      }
  });

  var htmlTemplate = "A new team has signed up for <b>NYCBA</b>!<br>";
  htmlTemplate += "<b>Team Name:</b> " + req.body.name + "<br>";
  htmlTemplate += "<b>Team Captain:</b> " + req.body.captain.name.first + " " + req.body.captain.name.last + "<br>";
  htmlTemplate += "cell: " + req.body.captain.cell + "<br>";
  htmlTemplate += "email: " + req.body.captain.email + "<br>";
  htmlTemplate += "<b>Team Co-Captain:</b> " + req.body.coCaptain.name.first + " " + req.body.coCaptain.name.last + "<br>";
  htmlTemplate += "cell: " + req.body.coCaptain.cell + "<br>";
  htmlTemplate += "email: " + req.body.coCaptain.email + "<br>";
  htmlTemplate += "There are " + req.body.players.length + " more <b>players:</b><br>";
  for (var i = 0; i < req.body.players.length; i++){
    htmlTemplate += req.body.players[i] + "<br>"
  }
  htmlTemplate += "<br><br>";
  htmlTemplate += "<b>Payment Info:</b><br>";
  htmlTemplate += "Billing Info:<br>";
  htmlTemplate += "Name: " + req.body.cc.name.first + " " + req.body.cc.name.last + "<br>";
  htmlTemplate += "Address: " + req.body.cc.address1 + "<br>";
  htmlTemplate += "Address: " + req.body.cc.address2 + "<br>";
  htmlTemplate += "State: " + req.body.cc.state + "<br>";
  htmlTemplate += "Phone: " + req.body.cc.phone + "<br>";
  htmlTemplate += "Email: " + req.body.cc.email + "<br>";
  htmlTemplate += "Card Info:<br>";
  htmlTemplate += "Card Type: " + req.body.cc.cardType + "<br>";
  htmlTemplate += "Number: " + req.body.cc.number + "<br>";
  htmlTemplate += "Expiration: " + req.body.cc.expiration.month + " " + req.body.cc.expiration.year + "<br>";
  htmlTemplate += "Security Code: " + req.body.cc.security + "<br>";

  var displayCC;

  if (req.body.cc.type === "American Express"){
    displayCC = "**** **** *** " + req.body.cc.number.substring(10, 15);
  }
  else{
    displayCC = "**** **** **** " + req.body.cc.number.substring(11, 16);
  }

  var displayCSV;
  
  if (req.body.cc.type === "American Express"){
    displayCSV = "****";
  }
  else{
    displayCSV = "***";
  }

  var htmlTemplateConfirmation = "Thank you for signing up for <b>NYCBA</b>!<br>";
  htmlTemplateConfirmation += "Your application and payment are being processed. You will receive another confirmation email shortly.<br>";
  htmlTemplateConfirmation += "<b>Team Name:</b> " + req.body.name + "<br>";
  htmlTemplateConfirmation += "<b>Team Captain:</b> " + req.body.captain.name.first + " " + req.body.captain.name.last + "<br>";
  htmlTemplateConfirmation += "cell: " + req.body.captain.cell + "<br>";
  htmlTemplateConfirmation += "email: " + req.body.captain.email + "<br>";
  htmlTemplateConfirmation += "<b>Team Co-Captain:</b> " + req.body.coCaptain.name.first + " " + req.body.coCaptain.name.last + "<br>";
  htmlTemplateConfirmation += "cell: " + req.body.coCaptain.cell + "<br>";
  htmlTemplateConfirmation += "email: " + req.body.coCaptain.email + "<br>";
  htmlTemplateConfirmation += "There are " + req.body.players.length + " more <b>players:</b><br>";
  for (var i = 0; i < req.body.players.length; i++){
    htmlTemplateConfirmation += req.body.players[i] + "<br>"
  }
  htmlTemplateConfirmation += "<br><br>";
  htmlTemplateConfirmation += "<b>Payment Info:</b><br>";
  htmlTemplateConfirmation += "Billing Info:<br>";
  htmlTemplateConfirmation += "Name: " + req.body.cc.name.first + " " + req.body.cc.name.last + "<br>";
  htmlTemplateConfirmation += "Address: " + req.body.cc.address1 + "<br>";
  htmlTemplateConfirmation += "Address: " + req.body.cc.address2 + "<br>";
  htmlTemplateConfirmation += "State: " + req.body.cc.state + "<br>";
  htmlTemplateConfirmation += "Phone: " + req.body.cc.phone + "<br>";
  htmlTemplateConfirmation += "Email: " + req.body.cc.email + "<br>";
  htmlTemplateConfirmation += "Card Info:<br>";
  htmlTemplateConfirmation += "Card Type: " + req.body.cc.cardType + "<br>";
  htmlTemplateConfirmation += "Number: " + displayCC + "<br>";
  htmlTemplateConfirmation += "Expiration: " + req.body.cc.expiration.month + " " + req.body.cc.expiration.year + "<br>";
  htmlTemplateConfirmation += "Security Code: " + displayCSV + "<br>";


  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "NYCBA <no-reply@nycba.com>", // sender address
      to: "nycba.league@gmail.com", // list of receivers
      subject: "A team has signed up!", // Subject line
      text: "A team has signed up!", // plaintext body
      html: htmlTemplate // html body
  }

  // setup e-mail data with unicode symbols
  var mailOptionsConfirmation = {
      from: "NYCBA <no-reply@nycba.com>", // sender address
      to: req.body.cc.email, // list of receivers
      subject: "Thank you for signing up!", // Subject line
      text: "Thank you for signing up!", // plaintext body
      html: htmlTemplateConfirmation // html body
  }

// send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    smtpTransport.sendMail(mailOptionsConfirmation, function(error, responseConfirm){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + responseConfirm.message);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      smtpTransport.close(); // shut down the connection pool, no more messages
      return res.send('success');
    });
    // // if you don't want to use this transport object anymore, uncomment following line
    // smtpTransport.close(); // shut down the connection pool, no more messages
    // return res.send('success');
  });
};


exports.getRandomPlayers = function(req, res){
  var teamId = req.query.teamId;
  var playerId = req.query.playerId;
  Season.find({'status': 1}, function(err, season) {
    if (err)
      res.send(err);

    // console.log('seasonId is ' + season[0]._id);

    if ((season.length !== 0) && (teamId !== 0)){
      Division.aggregate({'$match': {'seasonId': mongoose.Types.ObjectId(season[0]._id)}}) 
            .unwind('teams')
            .project({
              divisionId: '$_id',
              teamId: '$teams.teamId',
              currentPlayers: '$teams.players'
            })
            .match({teamId: mongoose.Types.ObjectId(teamId)})
            .exec(function(err, divisionInfo){
                    if (err)
                      return res.send(err);
                    // console.log(divisionInfo);
                    var divisionId = divisionInfo[0].divisionId;
                    console.log('divisionId is ' + divisionId);
                    console.log('teamId is ' + teamId);
                    Division.aggregate({'$match': {'_id': mongoose.Types.ObjectId(divisionId)}}) 
                            .unwind('teams')
                            .project({
                              teamId: '$teams.teamId',
                              players: '$teams.players'
                            })
                            .match({teamId: mongoose.Types.ObjectId(teamId)})
                            .unwind('players')
                            .project({
                              playerId: '$players.playerId'
                            })
                            .match({playerId: {'$ne': mongoose.Types.ObjectId(playerId)}})
                            .limit(4)
                            .exec(function(err, playersIds) {
                              if (err) {console.log('error ' + err); return res.send(err);}
                              // console.log('found this: ' + playersIds);
                              var found = 0;
                              var players = [];
                              for (var i = 0; i < playersIds.length; i++){
                                // console.log('playersIds[i]' + playersIds[i].playerId);
                                Player.findOne({'_id': mongoose.Types.ObjectId(playersIds[i].playerId)}, function(err, player) {
                                  if (err)
                                    return res.send(err);
                                  // console.log(player);
                                  players.push(player);
                                  // console.log('found ' + found);
                                  if (++found === playersIds.length){
                                    // console.log('returning: ' + players);
                                    return res.json(players);
                                  }
                                });
                              }
                              
                            });
                    // console.log(teamInfo);
                    //return res.json(divisionInfo);
                  });
      }
      else if (teamId === 0){
        Division.aggregate({'$match': {'seasonId': mongoose.Types.ObjectId(season[0]._id)}}) 
                .unwind('teams')
                .project({
                  teamId: '$teams._id',
                  players: '$teams.players'
                })
                .unwind('players')
                .project({
                  playerId: '$players.playerId'
                })
                .limit(4)
                .exec(function(err, playersIds) {
                  if (err) return res.send(err);
                  // console.log(playersIds);
                  var found = 0;
                  var players = [];
                  for (var i = 0; i < playersIds.length; i++){
                    // console.log('playersIds[i]' + playersIds[i].playerId);
                    Player.findOne({'_id': mongoose.Types.ObjectId(playersIds[i].playerId)}, function(err, player) {
                      if (err)
                        return res.send(err);
                      // console.log(player);
                      players.push(player);
                      if (++found === playersIds.length){
                        // console.log('returning: ' + players);
                        return res.json(players);
                      }
                    });
                  }
                  
                });
      }
      else{
        return res.send({});
      }

  });
}