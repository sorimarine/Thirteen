const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const ejs = require('ejs');
const {
  joinRoom,
  leaveRoom,
  getAllUsers,
  getCurrentUser,
  ROOM_LIMIT
} = require('./utils/users');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// port to listen to
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  let roomOccupancies = {};
  Object.values(getAllUsers()).forEach(user => {
    if (!roomOccupancies[user.room]) {
      roomOccupancies[user.room] = 0;
    }
    roomOccupancies[user.room] += 1;
  });
  res.render('index', {roomOccupancies: roomOccupancies, limit: ROOM_LIMIT});
});

app.get('/gameRoom', (req, res) => {
  res.render('gameRoom');
});

io.on('connection', socket => {
  socket.on('disconnect', () => {
    const user = leaveRoom(socket.id);
  });

  socket.on('joinRoom', ({ username, room }) => {
    const user = joinRoom(socket.id, username, room);
    socket.join(user.room);
  });

  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, message));
  });
});


// starts up server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});