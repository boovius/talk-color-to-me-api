const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = [];

const ROOMS = {};
class Player {
  constructor(name, socket, isRoomOwner) {
    this.name = name;
    this.socket = socket;
    this.isRoomOwner = isRoomOwner;
  }
}

class Room {
  constructor(owner, visitor) {
    this.owner = owner;
    this.visitor = visitor;
    this.name = owner.name;
  }
}

io.on('connection', socket => {
  const { username, roomname } = socket.handshake.query;

  if (roomname === username) {
    ROOMS[roomname] = new Room(new Player(username, socket, true));
  } else {
    ROOMS[roomname].visitor = new Player(username, socket, false);
  }

  const room = ROOMS[roomname];

  socket.join(room.name);
  socket.on(room.name, (from, msg) => {
    console.log(`I received a private message by ${from} saying ${msg}`);
  });
});

// app.post('/signin', (req, res) => {
//   const { username } = req.body;
//   players.push(username);
//   res.send(username);
// });

app.post('/exit', (req, res) => {
  const { roomname, isRoomOwner } = req.body;
  const room = rooms[roomname];

  // fix up this logic so visitors are not stranded
  if (isRoomOwner) {
    delete rooms[roomname];
  } else {
    room.visitor = null;
  }

  res.send(rooms);
});

app.get('/rooms', (req, res) => {
  console.log('ROOMS', ROOMS)
  res.send(Object.values(ROOMS));
});

server.listen(9000, () => {
  console.log('server listening on port 9000');
});
