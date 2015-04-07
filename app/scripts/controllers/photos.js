'use strict';

angular.module('nycbaApp')
  .controller('PhotosCtrl', function ($scope, $http) {
    $scope.photos = ['./images/photos/NYCBA_Jersey_orange_front.png', './images/photos/NYCBA_Jersey_orange_back.png', './images/photos/NYCBA_Jersey_Grey_front.png', './images/photos/NYCBA_Jersey_Grey_back.png'];
  });
