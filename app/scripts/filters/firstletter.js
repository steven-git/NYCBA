'use strict';

angular.module('nycbaApp')
  .filter('firstLetter', function () {
    return function (input) {
      var firstLetters = [];
      if (input){
        input.forEach(function (item) {
          var firstLetter = item.name.last.charAt(0).toUpperCase();
          if (firstLetters.indexOf(firstLetter) === -1) {
            firstLetters.push(firstLetter);
          }
        });
  	  }
      return firstLetters;
    }
  });

angular.module('nycbaApp')
  .filter('firstLetterTeam', function () {
    return function (input) {
      var firstLetters = [];
      if (input){
        input.forEach(function (item) {
          var firstLetter = item.name.charAt(0).toUpperCase();
          if (firstLetters.indexOf(firstLetter) === -1) {
            firstLetters.push(firstLetter);
          }
        });
  	  }
      return firstLetters;
    }
  });