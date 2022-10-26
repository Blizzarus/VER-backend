import { time } from "console";
import { WebSocketServer } from "ws";
var http=require("http");
var url = require('url');  
var fs = require('fs');
var server = http.createServer(function(request: any, response: any) {
  try {
    fs.readFile("WebClient.html", function(error: any, data: any) {  
      if (error) {  
          response.writeHead(404);  
          response.write(error);  
          response.end();  
      } else {  
          response.writeHead(200, {  
              'Content-Type': 'text/html'  
          });  
          response.write(data);  
          response.end();  
      }  
    });
  }
  catch(error) {
    console.log(error);
  }
});
server.listen(10118);
console.log("Http server started");


/*         Websocket Server         */
const wss: WebSocketServer = new WebSocketServer({ port: 10117 });
console.log("WS server started");
wss.on("connection", function connection(ws, req) {
  console.log("connected to " + req.socket.remoteAddress?.toString());

  ws.on("message", function message(data) {
    console.log("received: %s", data.toString());
    ws.send("Server says hi!");
  });
});

