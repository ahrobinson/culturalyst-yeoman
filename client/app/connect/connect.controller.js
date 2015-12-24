'use strict';

angular.module('culturalystApp')
  .controller('ConnectCtrl', function ($scope, $http, $location) {
    var artistId = $location.path().split('/').pop();


    $scope.register = function(){
      console.log('registering bruh')
      $http({
        method: 'POST',
        url: '/register',
        data: {
          data: {
            managed: true,
            legal_entity: {
              address: {
                line1: $scope.address,
                city: $scope.city,
                state: $scope.state,
                postal_code: $scope.zip,
                country: $scope.country,

              },
            },
            email: $scope.email,
          },
          _id: artistId
        }
      })
    };



  });
