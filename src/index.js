'use strict';

const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');
const server = http.createServer();
const port = 3000;

var io = socket(server, {
    pingInterval: 10000,
    pingTimeout: 5000
});

const nsp = io.of("/gamemanager");                    //namespace for unity game manager

nsp.use((socket, next) => {                           //middleware function for namespace
  if (socket.handshake.query.token === "UNITY") {     //verify UNITY token
      next(); 
  } else {
      next(new Error("Authentication error"));        //or raise error
  }
});

nsp.on('connection', socket => {                      //when UNITY connects to the server
  console.log('Unity connected');                    //debugging log

  setTimeout(() => {
    socket.emit('connection', {date: new Date().getTime(), data: "Hello Unity"})    //say hello to the game engine
  }, 1000);

  socket.on('requestGameState', () => {                 //called on start up by player client
    console.log('Received request for gamestate');      //debugging log
    socket.emit('updateGameState', data);               //send game state back to requester only
  });

  socket.on('serverToGMSolveEvent', (data) => {                 //action by player client
    console.log('Received solved event. Guess is: ' + data);    //debugging log
  });

});

app.get('/', (req,res) => {                              //no namespace should be directed here
  res.sendFile(__dirname + '/index.html');               //to connect to html file
});

io.on('connection', (socket) => {                       //non UNITY connect
  console.log('New Player connected');                  //debugging log
  socket.of('gamemanager').emit('requestGameState');    //emit request to game manager

  socket.on('updateGameState', (data) => {              //when gamemanager emits updategamestate event
    console.log('Game State received as: ' + data);     //debugging log
  });

  socket.on('solveEvent', (data) => {                       //when player tries to solve
    console.log('Sending solve event with data: ' + data);  //debugging log
    socket.of('gamemanager').emit('serverToGMSolveEvent', data);  //forward to gamemanager
  })
})

server.listen(port, () => {
  console.log('listening on *:' + port);                  //listening on port 3000
});