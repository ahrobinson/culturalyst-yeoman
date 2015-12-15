'use strict';

angular.module('culturalystApp')
  .factory('Artist', ['$http',function ($http) {
    return function(id){
      return $http({
        method: 'GET',
        url: 'api/user/artist/' + id
      });
    };
  }]);
