var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js');
var movies = require('./movies.js');

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.get('/room', function (req, res) {
  var room = req.url.split('?')[1];

  res.send(getRoomData(room));
});

app.get('/movies', function (req, res) {
  res.send(movies.getThree());
});

var getRoomData = function (room) {
  if (!game.rooms[room]) {
    return {error: 'Room does not exist, creating room "' + room + '".'};
  }

  var roomData = {
    emojiLog: game.rooms[room].emojiLog,
    currentAsker: game.rooms[room].currentAsker,
    players: game.rooms[room].players
  };

  return roomData;
};

// -- SOCKET.IO

// AT THE MOMENT there is ony one room called simply 0.
// todo: add the ability to create and join specific rooms

io.on('connection', function (socket) {

  socket.on('join', function (name) {
    game.joinRoom(name, 0, socket.id);

    console.log('A user has connected:', name);
    io.emit('player-join', getRoomData(0));
  });

  socket.on('guess', function (data) {
    data.points = game.guess(data.room, data.guess, data.username);

    console.log(data.username, 'guessed', data.guess, '...', data.points ? 'CORRECT!' : 'WRONG!');
    if (data.points) {
      io.emit('guess', {username: data.username, answer: data.guess, points: data.points});
    }
  });

  socket.on('ready', function (data) {
    game.selectMovie(data.room, data.movie);

    console.log(data.username, 'selected', data.movie);
    io.emit('ready');
  });

  socket.on('skip', function (data) {
    console.log(game.rooms[data.room].players[game.rooms[data.room].currentAsker].name, 'skipped their turn.');

    game.newRound(data.room);
    io.emit('skip');
  });

  socket.on('emote', function (data) {
    game.submitEmojis(data.room, data.emojis);

    console.log(game.rooms[data.room].players[game.rooms[data.room].currentAsker].name, 'emoted', data.emojis);
    io.emit('emote', data);
  });

  socket.on('disconnect', function () {
    if (!game.rooms[0]) return;

    var name = game.leaveRoom(socket.id, 0);
    console.log('A user has disconnected:', name);

    if (!game.rooms[0]) return;

    io.emit('player-leave', getRoomData(0));
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);
