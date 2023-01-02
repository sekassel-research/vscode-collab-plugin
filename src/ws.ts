import { buildCursorMovedMessage, buildTextChangedMessage, buildUserMessage } from "./util/jsonUtils";

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');


export function openWS(name:string,project:string){ 
    ws.on('open', function open() {   
        ws.on('message', function incoming(data:any) {
          const msg:message = JSON.parse(Buffer.from(data).toString());
          console.log(JSON.stringify(msg));
        });
        ws.send(buildUserMessage("userJoined",name,project));
      });
}

export function closeWS(name:string,project:string){
  ws.send(buildUserMessage("userLeft",name,project));
  ws.close(1000, 'connection was closed by the user');
}

export function cursorMoved(pathName:string,lineNumber:any,position:any,name:string,project:string){
  try{
    ws.send(buildCursorMovedMessage(pathName,lineNumber,position,name,project));
  } catch(Error){
    console.log(Error);
  }
}

export function textChanged(pathName:string,lineNumber:any,content:string,name:string,project:string){
  try{
    ws.send(buildTextChangedMessage(pathName,lineNumber,content,name,project));
  } catch(Error){
    console.log(Error);
  }
}
  
ws.on('error', (error:Error) => {
  console.log(`Fehler: ${error}`);
});