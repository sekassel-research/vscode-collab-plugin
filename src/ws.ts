const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

export function openWS(){
    ws.on('open', function open() {
        console.log("open called")
        ws.send('Hello World');
      });
}

ws.on('message', function incoming(data:any) {
    console.log(Buffer.from(data).toString());
  });