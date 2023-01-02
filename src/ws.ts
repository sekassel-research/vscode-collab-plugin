const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');


export function openWS(name:string,project:string){ 
    ws.on('open', function open() {   
        ws.on('message', function incoming(data:any) {
          const msg = JSON.parse(Buffer.from(data).toString());
          console.log(JSON.stringify(msg));
        });
        ws.send(`{"operation":"userJoined","name":"${name}","project":"${project}"}`);
      });
}

export function closeWS(name:string,project:string){
    ws.send(`{"operation":"userLeft","name":"${name}","project":"${project}"}`); 
    ws.close(1000, 'connection was closed by the user');
}

export function cursorMoved(pathName:string,lineNumber:any,position:any,name:string,project:string){
  console.log("sendCursor");
  console.log(pathName);
  try{
    const jsonString = `{"operation":"cursorMoved","pathName":"${pathName}","lineNumber":"${lineNumber}",
                          "position":"${position}","name":"${name}", "project":"${project}"}`;
    ws.send(jsonString);
  } catch(Error){
    console.log(Error);
  }
}

export function textChanged(pathName:string,lineNumber:any,content:string,name:string,project:string){
  console.log("textChanged");
  console.log(pathName);
  try{
    const jsonString = `{"operation":"textChanged","pathName":"${pathName}","lineNumber":"${lineNumber}",
                          "content":"${content}","name":"${name}", "project":"${project}"}`;
    ws.send(jsonString);
  } catch(Error){
    console.log(Error);
  }
}
  
ws.on('error', (error:Error) => {
  console.log(`Fehler: ${error}`);
});