import { time } from "console";
import { WebSocketServer } from "ws";

/*         Websocket Server         */
const wss: WebSocketServer = new WebSocketServer({ port: 10117 });
console.log("server started");
wss.on("connection", function connection(ws, req) {
  console.log("connected to " + req.socket.remoteAddress?.toString());

  ws.on("message", function message(data) {
    console.log("received: %s", data.toString());
    ws.send("pizza");
  });
});

