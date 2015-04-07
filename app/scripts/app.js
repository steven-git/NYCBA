'use strict';

angular.module('nycbaApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/footer', {
        templateUrl: 'partials/footer',
        controller: 'FooterCtrl'
      })
      .when('/divisions', {
        templateUrl: 'partials/divisions',
        controller: 'DivisionsCtrl'
      })
      .when('/teams', {
        templateUrl: 'partials/teams',
        controller: 'TeamsCtrl'
      })
      .when('/players', {
        templateUrl: 'partials/players',
        controller: 'PlayersCtrl'
      })
      .when('/scores', {
        templateUrl: 'partials/scores',
        controller: 'ScoresCtrl'
      })
      .when('/statistics', {
        templateUrl: 'partials/statistics',
        controller: 'StatisticsCtrl'
      })
      .when('/standings', {
        templateUrl: 'partials/standings',
        controller: 'StandingsCtrl'
      })
      .when('/more', {
        templateUrl: 'partials/more',
        controller: 'MoreCtrl'
      })
      .when('/division/:divisionId', {
        templateUrl: 'partials/division',
        controller: 'DivisionCtrl'
      })
      .when('/team/:teamId', {
        templateUrl: 'partials/team',
        controller: 'TeamCtrl'
      })
      .when('/player/:playerId', {
        templateUrl: 'partials/player',
        controller: 'PlayerCtrl'
      })
      .when('/statistic/:divisionId', {
        templateUrl: 'partials/statistic',
        controller: 'StatisticCtrl'
      })
      .when('/standing/:divisionId', {
        templateUrl: 'partials/standing',
        controller: 'StandingCtrl'
      })
      .when('/score/:divisionId', {
        templateUrl: 'partials/score',
        controller: 'ScoreCtrl'
      })
      .when('/rules', {
        templateUrl: 'partials/rules',
        controller: 'RulesCtrl'
      })
      .when('/photos', {
        templateUrl: 'partials/photos',
        controller: 'PhotosCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });