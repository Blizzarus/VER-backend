const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

// const { networkInterfaces } = require('os');

// const nets = networkInterfaces();
// const results = Object.create(null); // Or just '{}', an empty object

// for (const name of Object.keys(nets)) {
//     for (const net of nets[name]) {
//         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//         // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
//         const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
//         if (net.family === familyV4Value && !net.internal) {
//             if (!results[name]) {
//                 results[name] = [];
//             }
//             results[name].push(net.address);
//         }
//     }
// }

// console.log(nets, results);

const io = require('socket.io')(http, {
  cors: {
    origin:['http://localhost:3000', 'http://192.168.1.15:3000'],
  },
});

// io.use((socket, next) => {                            // middleware function 
//   if (socket.handshake.query.token === "UNITY") {   //verify UNITY token
//       next();
//   } else {
//       next(new Error("Authentication error"));      // or raise error
//   }
// });

const web = io.of('/web');
web.on('connection', (socket) => {

  /*socket.on('STPUpdateGameState', (data) => {
    if (socket.gamestate != data) {
      socket.gamestate = data;
      console.log('Gamestate updated');
    } else {
      console.log('Gamestate already up to date');
    }
  });*/
  
  socket.on('send-username', (data) => {
    socket.username = data;
    io.of('/').emit('requestGameState', socket.username);
    console.log(`New Player connected: ${socket.username}. Requesting Game State from GM.`);
  })
  
  socket.on('PTSSolve', (data) => {
    const message = socket.username + data;
    console.log(message);
    socket.emit('STGSolve', message);
  });
  
  socket.on('disconnect', () => {
    console.log(`${socket.username} has left the game`);
  });
})

io.on('connection', (socket) => {
  console.log(`Unity client connected.`);

  socket.on('updateGameState', (data) => {
    console.log(`Attempting to forward gamestate ${data} to client`);
    io.of('/web').emit('STPUpdateGameState', data);
  });

});

http.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
