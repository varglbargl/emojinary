var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js');

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.get('/room', function (req, res) {
  var room = req.url.split('?')[1];

  res.send(getRoomData(room));
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
    data.result = game.guess(data.room, data.guess, data.player);

    console.log(data.username, 'guessed', data.guess, '...', data.result ? 'CORRECT!' : 'WRONG!');
    io.emit('guess', data);
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
