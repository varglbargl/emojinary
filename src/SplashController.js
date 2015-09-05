emojinary.controller('SplashController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
  if ($rootScope.socket) {
    $rootScope.socket.disconnect();
    $rootScope.username = '';
    $rootScope.socket = null;
    $rootScope.score = 0;
  }

  $scope.showRules = false;
  $scope.showCredits = false;

  var logos = ['mojies-topgun.png', 'mojies-bladerunner.png', 'mojies-aliens.png'];

  $scope.randomLogo = logos[Math.floor(Math.random()*logos.length)];

  $scope.play = function () {
    $rootScope.username = prompt('Select a username:');
    if (!$rootScope.username) return;

    $rootScope.socket = io();

    $location.path('/lobby');
  };

  $scope.toggleRules = function () {
    $scope.showRules = !$scope.showRules;
  };

  $scope.toggleCredits = function () {
    $scope.showCredits = !$scope.showCredits;
  };
}]);
