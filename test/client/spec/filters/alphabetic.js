'use strict';

describe('Filter: alphabetic', function () {

  // load the filter's module
  beforeEach(module('nycbaApp'));

  // initialize a new instance of the filter before each test
  var alphabetic;
  beforeEach(inject(function ($filter) {
    alphabetic = $filter('alphabetic');
  }));

  it('should return the input prefixed with "alphabetic filter:"', function () {
    var text = 'angularjs';
    expect(alphabetic(text)).toBe('alphabetic filter: ' + text);
  });

});
