var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js');
var movies = require('./movies.js');

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/room', function (req, res) {
  var room = req.url.split('?')[1];

  console.log(room, Object.keys(game.rooms));

  res.send(getRoomData(room));
});

app.get('/rooms', function (req, res) {
  var rooms = Object.keys(game.rooms);

  res.send(rooms);
});

app.post('/rooms', function (req, res) {
  console.log('Creating room named', req.body.room);
  var success = game.createRoom(req.body.room);
  if (success) {
    res.send({success: true});
  } else {
    res.send({error: 'Room named ' + req.body.room + ' already exists.'});
  }
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

  socket.on('join', function (data) {
    game.joinRoom(data.name, data.room, socket.id);

    console.log('A user has connected:', data.name);
    io.emit('player-join', getRoomData(data.room));
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
    var player = game.leaveRoom(socket.id);

    if (!player) return;
    console.log('A user has disconnected:', player.name);

    io.emit('player-leave', getRoomData(player.room));
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
http.listen(port);
