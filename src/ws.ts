const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

export function openWS(){
    ws.on('open', function open() {
        ws.send('Hello World');
      });
}
