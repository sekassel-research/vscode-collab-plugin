const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

export function openWS(name:string,project:string){
    ws.on('open', function open() {   
        ws.on('message', function incoming(data:any) {
          const msg = JSON.parse(Buffer.from(data).toString());
          console.log(JSON.stringify(msg));
        });
        ws.send(`{"operation":"joined","name":"${name}","project":"${project}"}`);
      });
}

export function closeWS(name:string,project:string){
    ws.close(1000, `{"operation":"closed","name":"${name}","project":"${project}"}`);
}

export function cursorMoved(fileName:string,lineNumber:any,position:any,name:string,project:string){
  console.log("sendCursor");
  console.log(fileName);
  try{
    const jsonString = `{"operation":"cursorMoved","fileName":"${fileName}","lineNumber":"${lineNumber}",
                          "position":"${position}","name":"${name}", "project":"${project}"}`;
    ws.send(jsonString);
  } catch(Error){
    console.log(Error);
  }
  
}
  
ws.on('error', (error:Error) => {
  console.log(`Fehler: ${error}`);
});