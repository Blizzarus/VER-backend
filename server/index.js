const express = require('express');
const app = express();
const path = require('path');
const PORT = 4000;
const WEBPORT = 3000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, "build")));
app.use("/", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, "build", "index.html"));
});
app.listen(3000);


const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

const ips = Object.values(results).map(e => 'http://' + e[0] + ':' + WEBPORT);
ips.push('http://localhost:' + WEBPORT);

const io = require('socket.io')(http, {
  cors: {
    origin: ips
  },
});

const web = io.of('/web');
const unity = io.of('/');
unity.use((socket, next) => {
  if (socket.handshake.query.token === "UNITY") {
      next();
  } else {
      next(new Error("Authentication error"));
  }
});

web.on('connection', (socket) => {
  console.log(`Web Client connected: ${socket.id}`);
  socket.emit('request-logged-in-user');
  socket.on('send-username', (data) => {
    if (socket.username === undefined || socket.username === null) {
      socket.username = data;
      console.log(`Player connected: ${socket.username}.`);
    }
    console.log(`Requesting Game State from GM.`)
    unity.emit('requestGameState', socket.username);
  })
  
  socket.on('solveEvent', (data) => {
    const message = socket.username + data;
    unity.emit('solveEvent', message);
  });

  socket.on('requestGameState', (data) => {
    unity.emit('requestGameState', socket.username);
  });
  
  socket.on('disconnect', () => {
    console.log(`${socket.username} has left the game`);
  });
})

unity.on('connection', (socket) => {
  console.log(`Unity client connected.`);
  socket.emit('requestGameState');
  socket.on('updateGameState', (data) => {
    console.log(`Attempting to forward gamestate "${data}" to client`);
    web.emit('updateGameState', data);
  });

  socket.on('solveEvent', (data) => {
    console.log('solveEvent', data);
    web.emit('solveResult', data);
  });

});

http.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
