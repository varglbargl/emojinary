emojinary.controller('SplashController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
  if ($rootScope.socket) {
    $rootScope.socket.disconnect();
    $rootScope.username = '';
    $rootScope.socket = null;
    $rootScope.score = 0;
  }

  $scope.play = function () {
    $rootScope.username = prompt('Select a username:');
    if (!$rootScope.username) return;

    $rootScope.socket = io();
    $rootScope.room = 0;

    $location.path('/lobby');
  };
}]);
