emojinary.controller('SplashController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

  $scope.showRules = false;
  $scope.showCredits = false;

  var logos = ['mojies-topgun.png', 'mojies-bladerunner.png', 'mojies-aliens.png'];

  $scope.randomLogo = logos[Math.floor(Math.random()*logos.length)];

  $scope.play = function () {
    $rootScope.username = prompt('Select a username:');
    if (!$rootScope.username) return;

    if ($rootScope.socket) {
      $rootScope.socket.connect();
    } else {
      $rootScope.socket = io();
    }

    $location.path('/lobby');
  };

  $scope.toggleRules = function () {
    $scope.showRules = !$scope.showRules;
  };

  $scope.toggleCredits = function () {
    $scope.showCredits = !$scope.showCredits;
  };
}]);
