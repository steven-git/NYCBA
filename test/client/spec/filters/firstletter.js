'use strict';

describe('Filter: firstLetter', function () {

  // load the filter's module
  beforeEach(module('nycbaApp'));

  // initialize a new instance of the filter before each test
  var firstLetter;
  beforeEach(inject(function ($filter) {
    firstLetter = $filter('firstLetter');
  }));

  it('should return the input prefixed with "firstLetter filter:"', function () {
    var text = 'angularjs';
    expect(firstLetter(text)).toBe('firstLetter filter: ' + text);
  });

});
