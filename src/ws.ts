import {Position} from "vscode";
import {markLine, changeLine} from "./extension";
import {cursorMovedData, textChangedData} from "./interface/data";
import {message} from "./interface/message";
import {buildCursorMovedMessage, buildTextChangedMessage, buildUserMessage} from "./util/jsonUtils";

const WebSocket = require('ws');

let ws = new WebSocket('ws://localhost:8080');
let wsClose = false;


export function openWS(name: string, project: string) {
    ws = new WebSocket('ws://localhost:8080');
    ws.on('open', function open() {
        console.log("connected");

        ws.on('message', function incoming(data: any) {
            const msg: message = JSON.parse(Buffer.from(data).toString());
            console.log(JSON.stringify(msg));
            handleMessage(msg);
        });

        ws.send(buildUserMessage("userJoined", name, project));
    });

    ws.on('close', function close() {
        if (!wsClose) {
            // Starte den Wiederverbindungsprozess nach 10 Sekunden
            console.log('Verbindung geschlossen. retry in 10s');
            setTimeout(() => {
                openWS(name, project);
            }, 10000);
        }
    });

    ws.on('error', (error: Error) => {
        setTimeout(() => {
            console.log(error);
        }, 2000);
    });
}


export function closeWS(name: string, project: string) {
    wsClose = true;
    ws.send(buildUserMessage("userLeft", name, project));
    ws.close(1000, 'connection was closed by the user');
}

export function cursorMoved(pathName: string, lineNumber: number, position: number, selectionStart: number, selectionEnd: number, name: string, project: string) {
    try {
        ws.send(buildCursorMovedMessage(pathName, lineNumber, position, selectionStart, selectionEnd, name, project));
    } catch (Error) {
        console.log(Error);
    }
}

export function textChanged(pathName: string, lineNumber: any, content: string, name: string, project: string) {
    try {
        ws.send(buildTextChangedMessage(pathName, lineNumber, content, name, project));
    } catch (Error) {
        console.log(Error);
    }
}

function handleMessage(msg: message) {
    console.log("handleMessage called");

    if (msg.operation === "cursorMoved") {
        let data: cursorMovedData = msg.data;
        markLine(data.pathName, data.lineNumber, data.position, data.selectionStart, data.selectionEnd, data.name);
        return;
    }
    if (msg.operation === "textChanged") {
        let data: textChangedData = msg.data;
        changeLine(data.pathName, data.lineNumber, data.name, data.content);
        return;
    }
}
