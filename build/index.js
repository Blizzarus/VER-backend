"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8081 });
wss.on('connection', function connection(ws) {
    console.log("connected");
    ws.on('message', function message(data) {
        console.log('received: %s', JSON.parse(data.toString()).playerName);
    });
    ws.send(JSON.stringify('something'));
});
