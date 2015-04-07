'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  // app.route('/api/awesomeThings')
  //   .get(api.awesomeThings);

  app.route('/api/divisions')
    .get(api.getCurrentDivisions);

  app.route('/api/divisionById')
    .get(api.getDivisionById);

  app.route('/api/teamByDivision')
    .get(api.getTeamByDivision);

  app.route('/api/playersByDivision')
    .get(api.getPlayersByDivision);

  app.route('/api/players')
    .get(api.getPlayers);

  app.route('/api/playerById')
    .get(api.getPlayerById);

  app.route('/api/randomPlayers')
    .get(api.getRandomPlayers);

  app.route('/api/teamByPlayer')
    .get(api.getTeamByPlayer);

  app.route('/api/teams')
    .get(api.getTeams);

  app.route('/api/teamById')
    .get(api.getTeamById);

  app.route('/api/divisionByTeam')
    .get(api.getDivisionByTeam);

  app.route('/api/pastGamesByTeamId')
    .get(api.getPastGamesByTeamId);

  app.route('/api/upcomingGamesByTeamId')
    .get(api.getUpcomingGamesByTeamId);

  app.route('/api/lastWeekGames')
    .get(api.getLastWeekGames);

  app.route('/api/upcomingWeeksGames')
    .get(api.getUpcomingWeeksGames);

  app.route('/api/pastGames')
    .get(api.getPastGames);

  app.route('/api/upcomingGames')
    .get(api.getUpcomingGames);

  app.route('/api/playersByIds')
    .post(api.playersByIds);

  app.route('/api/signUpMail')
    .post(api.sendSignUpMail);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};