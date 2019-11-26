const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const subscribers = {};
const rooms = [
  {player1: 'text', player2: 'text'}
]

io.on('connection', socket => {
  const username = socket.handshake.query.username;
  subscribers[username] = socket;
  console.log('subscribers: ', subscribers);

  io.on(username, )
});

app.get('/', (req, res) => {
  const { username } = req.query;
  const subsList = Object.keys(subscribers).filter(sub => sub !== username);
  res.send(subsList);
});

server.listen(9000, () => {
  console.log('server listening on port 9000');
});
