'use strict';

angular.module('nycbaApp')
  .filter('alphabetic', function () {
    return function (input, letter) {
    	//console.log('alphabetic filter letter: ' + letter);
      var alphabetic = [];
      if (input){
        input.forEach(function (item) {
          var firstLetter = item.name.last.charAt(0).toUpperCase();
          if (firstLetter === letter) {
            alphabetic.push(item);
          }
        });
  	  }
      return alphabetic;
    }
  });


angular.module('nycbaApp')
  .filter('alphabeticTeam', function () {
    return function (input, letter) {
    	//console.log('alphabetic filter letter: ' + letter);
      var alphabetic = [];
      if (input){
        input.forEach(function (item) {
          var firstLetter = item.name.charAt(0).toUpperCase();
          if (firstLetter === letter) {
            alphabetic.push(item);
          }
        });
  	  }
      return alphabetic;
    }
  });


angular.module('nycbaApp')
  .filter('byWeek', function () {
    return function (input, week) {
      //console.log('alphabetic filter letter: ' + letter);
      var byWeek = [];
      if (input){
        input.forEach(function (item) {
          if (item.weekNumber === week) {
            byWeek.push(item);
          }
        });
      }
      return byWeek;
    }
  });