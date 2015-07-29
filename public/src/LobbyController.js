emojinary.controller('LobbyController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
  $scope.rooms = [];

  $scope.createRoom = function () {
    var name = prompt('Type a name for your room:');

    if (!name) {
      $location.path('/');
      return;
    }

    $http.post('/rooms', {room: name}).success(function (data) {
      if (data.success) {
        $rootScope.room = name;
        $location.path('/game');
      } else {
        alert(data.error);
      }
    });
  };

  $scope.joinRoom = function (room) {
    $rootScope.room = room;
    $location.path('/game');
  };

  $http.get('/rooms').success(function (data) {
    $scope.rooms = data;
  });
}]);
