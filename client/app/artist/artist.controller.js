'use strict';

angular.module('culturalystApp')
  .controller('ArtistCtrl', function($scope, $location, $http){
    var artistId = $location.path().split('/').pop();

    $http.get('/api/users/' + artistId).then(function(res) {
      console.log(res);
      $scope.artist = res.data;
    })

  });

    $scope.posts = $firebaseArray(cultFire.child('posts').child('/' + artistId).limitToLast(5))

    // console.log($scope.postsy)
    $scope.addPost = function(message) {
      console.log($scope.posts)
      // console.log($scope.postsId)
      $scope.posts.$add({
        name: $scope.artist.name,
        text: message,
        created: Firebase.ServerValue.TIMESTAMP,
        id: artistId
      });
      $scope.post = '';
    };
