'use strict';

const http = require('http');
const socket = require('socket.io');
const server = http.createServer();                   // dependencies and packages
const port = 8080;
const redisAdapter = require('socket.io-redis');

var io = socket(server, {
    pingInterval: 10000,                              // initialize io
    pingTimeout: 5000  
});

// io.adapter(redisAdapter({ 
//   host: 'localhost',                                  // REDIS ADAPTER TO UNITY CLIENT
//   port: 6379 
// })); 

io.use((socket, next) => {                            // middleware function 
    if (socket.handshake.query.token === "UNITY") {   //verify UNITY token
        next();
    } else {
        next(new Error("Authentication error"));      // or raise error
    }
});

io.on('connection', socket => {                      // when unity client connects
  console.log('Unity connected');                    //debugging log

  setTimeout(() => {
    socket.emit('connection', {date: new Date().getTime(), data: "Hello Unity"})  //say hello to unity
  }, 1000);                                                                       //after 1 second

  socket.on('requestGameState', () => {                 //called on start up by player client
    console.log('Received request for gamestate');      //debugging log
    socket.emit('updateGameState', data);               //send game state back to requester only
  });

  socket.on('serverToGMSolveEvent', (data) => {                //action by player client
    console.log('Received solve event. Guess is: ' + data);    //debugging log
  });

});


server.listen(port, () => {
  console.log('listening on *:' + port);
});
