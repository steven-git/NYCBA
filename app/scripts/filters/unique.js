'use strict';

angular.module('nycbaApp')
  .filter('unique', function () {
    return function (input) {
      var weeks = [];
      var result = [];
      if (input){
        input.forEach(function (item) {
          //var firstLetter = item.name.last.charAt(0).toUpperCase();
          if (weeks.indexOf(item.weekNumber) === -1) {
            weeks.push(item.weekNumber);
            result.push(item);
          }
        });
  	  }
  	  console.log(result);
  	  //console.log(weeks[0].day);
      return result;
  	}
  });
