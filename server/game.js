var movies = require('./movies.js');

exports.rooms = [
  {
    answer: '',
    emojiLog: [],
    currentAsker: 0,
    players: [
      // { id: "string",
      // name: "string",
      // score: integer }
    ]
  }
];

exports.joinRoom = function (name, room, id) {
  exports.rooms[room].players.push({id: id, name: name, answer: null, out: true});
};

exports.createRoom = function (room) {
  if (!exports.rooms[room]) {
    console.log('Creating room:', room);
    exports.rooms[room] = {players: [], currentAsker: 0, emojiLog: []};

    return true;
  }

  return false;
};

exports.leaveRoom = function (id, room) {
  var players = exports.rooms[room].players;
  var name = '';

  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      name = players[i].name;
      players.splice(i, 1);
      break;
    }
  }
  if (exports.rooms[room].currentAsker >= players.length) {
    exports.rooms[room].currentAsker = 0;
  }
  if (players.length === 0) {
    console.log('Deleting room:', room);
    exports.rooms[room] = null;
  }

  return name;
};

exports.selectMovie = function (room, movie) {
  exports.rooms[room].answer = movie;
};

exports.guess = function (room, guess, player) {
  var correct = guess.toLowerCase() === exports.rooms[room].answer.toLowerCase();

  if (correct) {
    for (var i = 0; i < exports.rooms[room].players.length; i++) {
      if (exports.rooms[room].players[i].name === player) {
        exports.rooms[room].players[i].score += 10;
      }
    }

    exports.newRound(room);
    return 10;
  }

  return 0;
};

exports.submitEmojis = function (room, emojis) {
  exports.rooms[room].emojiLog.push(emojis);
};

exports.newRound = function (room) {
  room = exports.rooms[room];
  var answer = room.answer;
  room.currentAsker++;
  room.answer = '';
  room.emojiLog = [];

  if (room.currentAsker >= room.players.length) {
    room.currentAsker = 0;
  }

  return answer;
};
