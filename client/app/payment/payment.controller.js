'use strict';

angular.module('culturalystApp')
  .controller('PaymentCtrl', function ($scope, $location, stripe, $http) {
    var artistId = $location.path().split('/').pop();
    $scope.form = {};
    $scope.recurring = false;



    $scope.submit = function(){

          //create token from their card credntials and send to /charge
      stripe.card.createToken($scope.form).then(function(tok){
        console.log('tok: ',tok)
        $http({
          method: 'POST',
          url: '/charge',
          data: {
            token: tok.id,
            amount: $scope.amount,
            recurring: $scope.recurring,
            _id: artistId
          }
        })
      })
    }

  });


  //http request for customer id
  // $http({
  //   method: 'GET',
  //   url: '/api/users/me'
  // }).then(function(res){
  //   console.log('res: ', res)
  //
  //   //if customer id
  //   if(res.data.custid){
  //     $http({
  //       //send cust id to /charge
  //       method: 'POST',
  //       url: '/charge',
  //       data: {
  //         customer: res.custid,
  //         amount: $scope.amount,
  //         recurring: $scope.recurring
  //       }
  //     })
  //   } else {}
