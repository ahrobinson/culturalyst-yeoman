'use strict';

angular.module('culturalystApp')
  .controller('ArtistCtrl', function($scope, $location, $http){
    var artistId = $location.path().split('/').pop();

    $http.get('/api/users/' + artistId).then(function(res) {
      console.log(res);
      $scope.artist = res.data;
    })

  });
