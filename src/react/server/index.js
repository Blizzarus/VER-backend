const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin:'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  socket.emit('requestGameState');
  
  socket.on('send-username', (data) => {
    socket.username = data;
    socket.gamestate = data;
    console.log(`New Player connected: ${socket.username}`);
  })
  
  socket.on('PTSSolve', (data) => {
    const message = socket.username + data;
    console.log(message);
    socket.emit('STGSolve', message);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} has left the game`);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
