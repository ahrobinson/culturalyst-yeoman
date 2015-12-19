'use strict';

angular.module('culturalystApp')

.controller('DiscoveryCtrl', function($scope, cultFire, $firebaseArray, MediaList, $http){
  $scope.mediaList = MediaList.getMediaList();
  console.log('hi')
  //$scope.artists = $firebaseArray(cultFire.child('Users'));
  console.log($scope.artists)


    $scope.getArtists = function() {
      $http.get('/api/users/discovery/' + $scope.selectedMedium + '/' + $scope.selectedSubmedium).then(function(response) {
        $scope.artists = response.data;
        console.log(response.data);
      })
    }

    $scope.loadSubMediums = function(medium){
      console.log(medium.name)
      $scope.selectedMedium = medium.name;
      $scope.submedia = medium.submedia;
    };

});
