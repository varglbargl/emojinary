var movies = require('./movies.js');

exports.rooms = {
  'Room_Zero':{
    hints: 0,
    answer: '',
    emojiLog: [],
    currentAsker: 0,
    players: [
      // { id: "string",
      // name: "string",
      // score: integer }
    ]
  }
};

exports.joinRoom = function (name, room, id) {
  exports.rooms[room].players.push({id: id, name: name});
};

exports.createRoom = function (room) {
  if (!exports.rooms[room]) {
    exports.rooms[room] = {players: [], currentAsker: 0, emojiLog: [], hints: 0, answer: ''};

    return true;
  }

  return false;
};

exports.leaveRoom = function (id, room) {
  var name = '';
  var players = [];
  var reset = false;

  if (room === undefined) {
    // locate player in any room
    for (var key in exports.rooms) {
      var searchRoom = exports.rooms[key];
      for (var i = 0; i < searchRoom.players.length; i++) {
        if (searchRoom.players[i].id === id) {
          room = key;
          name = searchRoom.players[i].name;
          searchRoom.players.splice(i, 1);
          players = searchRoom.players;

          if (searchRoom.currentAsker === i) {
            exports.newRound(room);
            reset = true;
          }

          break;
        }
      }
    }
  } else {
    players = exports.rooms[room].players;

    for (var i = 0; i < players.length; i++) {
      if (players[i].id === id) {
        name = players[i].name;
        players.splice(i, 1);
        break;
      }
    }
  }

  if (!room || !exports.rooms[room]) {
    return;
  }

  if (exports.rooms[room].currentAsker >= players.length) {
    exports.rooms[room].currentAsker = 0;
  }
  if (players.length === 0) {
    console.log('Deleting room:', room);
    delete exports.rooms[room];
  }

  return {name: name, room: room, reset: reset};
};

exports.selectMovie = function (room, movie) {
  exports.rooms[room].answer = movie;
};

exports.guess = function (room, guess, player) {
  var correct = guess.toLowerCase() === exports.rooms[room].answer.toLowerCase();
  var score = (3 - exports.rooms[room].hints) * 10;

  if (correct) {
    for (var i = 0; i < exports.rooms[room].players.length; i++) {
      if (exports.rooms[room].players[i].name === player) {
        exports.rooms[room].players[i].score += score;
      }
    }

    exports.newRound(room);
    return score;
  }

  return 0;
};

exports.submitEmojis = function (room, emojis) {
  exports.rooms[room].emojiLog.push(emojis);
};

exports.giveHint = function (room) {
  var hintsGiven = exports.rooms[room].hints;

  if (hintsGiven === 0) {
    exports.rooms[room].hints++;
    return exports.rooms[room].answer.replace(/[a-z0-9]/gi, '_');
  } else if (hintsGiven === 1) {
    exports.rooms[room].hints = 2;
    return exports.rooms[room].answer.replace(/\B\w/g, '_');
  }
};

exports.newRound = function (room) {
  room = exports.rooms[room];
  var answer = room.answer;
  room.currentAsker++;
  room.answer = '';
  room.hints = 0;
  room.emojiLog = [];

  if (room.currentAsker >= room.players.length) {
    room.currentAsker = 0;
  }

  return answer;
};
