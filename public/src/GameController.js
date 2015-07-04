emojinary.controller('GameController', ['$scope', '$rootScope', '$http', '$timeout', '$location', function ($scope, $rootScope, $http, $timeout, $location) {
  $scope.players = [];

  $scope.currentAsker = 0;
  $scope.you = null;
  $scope.guess = '';
  $scope.emojis = '';

  $scope.submitGuess = function () {
    $rootScope.socket.emit('guess', {
      username: $rootScope.username,
      room: $rootScope.room,
      guess: $scope.guess
    });
    $scope.guess = '';
  };

  $scope.submitEmojis = function () {
    $rootScope.socket.emit('emojis', {
      room: $rootScope.room,
      emojis: $scope.emojis
    });
    $scope.emojis = '';
  };

  // socket.io stuff. Remember to $digest() manually...

  $rootScope.socket.on('player-join', function (data) {
    if (data.error) {
      alert(data.error);
      $location.path('/');
      return;
    }

    initPlayers(data.players);

    // This assumes names are unique. Handle that server side.
    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i].name === $rootScope.username) {
        $scope.you = i;
      }
    }

    $scope.$digest();
  });

  $rootScope.socket.on('player-leave', function (data) {
    initPlayers(data.players);
    $scope.$digest();
  });

  $rootScope.socket.on('guess', function (data) {
    // broadcast results, switch players if !data.result
    if (data.result) {
      $timeout(function () {
        $scope.results.who = data.username;
      }, 1500);
      $timeout(function () {
        $scope.results.answer = data.answer;
      }, 3000);
      $timeout(function () {
        $scope.results.points = data.points;
      }, 4500);
      $timeout(function () {
        if (data.username === $rootScope.username) {
          $rootScope.score += data.points;
        }
        newRound();
        $rootScope.$digest();
      }, 7500);
    }
  });

  // game utils

  var newRound = function () {
    $scope.prompt = '';
    $scope.answers = [];
    $scope.phase = 'ask';
    $scope.currentAsker++;
    if ($scope.currentAsker >= $scope.players.length) {
      $scope.currentAsker = 0;
    }
  };

  var initPlayers = function (players) {
    $scope.players = players;
  };

  var isOnlyEmoji = function (str) {
    return (/^([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]|\uD83D[\uDE80-\uDEF3]|\uD83D[\uDE00-\uDE4f]|[\u2600-\u27BF]|\s)*$/gm).test(str);
  };

  // initial room construction

  $http.get('/room?0').success(function (data) {
    if (data.error) {
      console.log('Empty room response: ' + data.error);
    } else {
      $scope.currentAsker = data.currentAsker;
      initPlayers(data.players);
    }

    $rootScope.socket.emit('join', $rootScope.username);
  });
}]);
