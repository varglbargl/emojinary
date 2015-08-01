emojinary.controller('GameController', ['$scope', '$rootScope', '$http', '$timeout', '$location', function ($scope, $rootScope, $http, $timeout, $location) {
  $scope.players = [];

  $scope.currentAsker = 0;
  $scope.you = null;
  $scope.guess = '';
  $scope.emojis = '';
  $scope.ready = false;

  $scope.emojiLog = [];
  $scope.movieChoices = [];
  $scope.movie = '';
  $scope.hint = '';
  $scope.hintsLeft = 2;
  $scope.results = {};

  $scope.typeInput = function (evt) {
    if (evt.keyCode === 13) {
      $scope.submitGuess();
    }
  };

  $scope.submitGuess = function () {
    if ($scope.currentAsker === $scope.you) {
      if ($scope.isOnlyEmoji($scope.emojis) && $scope.emojis) {
        $rootScope.socket.emit('emote', {
          room: $rootScope.room,
          emojis: $scope.emojis
        });
        $scope.emojis = '';
      }
    } else {
      $rootScope.socket.emit('guess', {
        username: $rootScope.username,
        room: $rootScope.room,
        guess: $scope.guess
      });
      $scope.guess = '';
    }
  };

  $scope.selectWinner = function (player) {
    $rootScope.socket.emit('guess', {
      username: $scope.players[player].name,
      room: $rootScope.room,
      guess: $scope.movie
    });
    $scope.movie = '';
  };

  $scope.selectMovie = function (n) {
    $scope.movie = $scope.movieChoices[n];
    $scope.movieChoices = [];

    $rootScope.socket.emit('ready', {
      username: $rootScope.username,
      room: $rootScope.room,
      movie: $scope.movie
    });
  };

  $scope.giveHint = function () {
    if ($scope.hintsLeft === 0) return;

    $scope.hintsLeft--;

    $rootScope.socket.emit('hint', {
      username: $rootScope.username,
      room: $rootScope.room
    });
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

    if ($scope.players.length > 1 && $scope.currentAsker === $scope.you && $scope.movieChoices.length === 0 && !$scope.ready) {
      $http.get('/movies').success(function (data) {
        $scope.movieChoices = data;
      });
    }

    $scope.$digest();
  });

  $rootScope.socket.on('player-leave', function (data) {
    initPlayers(data.players);

    if ($scope.players.length > 1) {
      // This assumes names are unique. Handle that server side.
      for (var i = 0; i < data.players.length; i++) {
        if (data.players[i].name === $rootScope.username) {
          $scope.you = i;
        }
      }
    } else {
      newRound();
    }

    $scope.$digest();
  });

  $rootScope.socket.on('ready', function () {
    $scope.ready = true;
    $scope.$digest();
  });

  $rootScope.socket.on('skip', function () {
    newRound();
    $scope.$digest();
  });

  $rootScope.socket.on('emote', function (data) {
    $scope.emojiLog.push(data.emojis);
    $scope.$digest();
  });

  $rootScope.socket.on('hint', function (data) {
    $scope.hint = data.hint;
    $scope.$digest();
  });

  $rootScope.socket.on('guess', function (data) {
    // broadcast results, switch currentAsker
    $scope.results.username = data.username;
    $scope.results.answer = data.answer;
    $scope.results.points = data.points;
    $scope.$digest();

    $timeout(function () {
      if (data.username === $rootScope.username) {
        $rootScope.score += data.points;
      }
      newRound();
      $rootScope.$digest();
    }, 5000);
  });

  // game utils

  $scope.skipRound = function () {
    $scope.movie = '';
    $rootScope.socket.emit('skip', {room: $rootScope.room});
  };

  var newRound = function () {
    $scope.results = {};
    $scope.emojiLog = [];
    $scope.movie = '';
    $scope.hint = '';
    $scope.hintsLeft = 2;
    $scope.ready = false;
    $scope.currentAsker++;
    if ($scope.currentAsker >= $scope.players.length) {
      $scope.currentAsker = 0;
    }

    if ($scope.players.length > 1 && $scope.currentAsker === $scope.you) {
      $http.get('/movies').success(function (data) {
        $scope.movieChoices = data;
      });
    }
  };

  var initPlayers = function (players) {
    $scope.players = players;
  };

  $scope.isOnlyEmoji = function (str) {
    return (/^([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF]|[\u25A0-\u27BF]|[\u2900-\u297F]|\s)*$/gm).test(str);
  };

  // initial room construction

  $http.get('/room?' + $rootScope.room).success(function (data) {
    if (data.error) {
      console.log('Empty room response: ' + data.error);
    } else {
      $scope.currentAsker = data.currentAsker;
      initPlayers(data.players);
    }

    $rootScope.socket.emit('join', {name: $rootScope.username, room:$rootScope.room});
  });
}]);
