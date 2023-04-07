import * as vscode from 'vscode';
import {
    addActiveUsers,
    getChatViewProvider,
    getTextChangeQueue,
    markLine,
    replaceText,
    userJoined,
    userLeft,
    workThroughTextQueue
} from "./extension";
import {ChatData, CursorMovedData, TextReplacedData} from "./interface/data";
import {Message} from "./interface/message";
import {
    buildChatMessage,
    buildCursorMovedMessage,
    buildTextReplacedMessage,
    buildUserMessage
} from "./util/jsonUtils";

const webSocket = require('ws');

let ws = new webSocket('ws://localhost:8080');
let wsClose = false;


export function openWS(name: string, project: string) {
    ws = new webSocket('ws://192.168.178.159:8080');
    ws.on('open', function open() {

        ws.on('message', function incoming(data: any) {
            const msg: Message = JSON.parse(Buffer.from(data).toString());
            handleMessage(msg);
        });

        ws.send(buildUserMessage("userJoined", name, project));
    });

    ws.on('close', function close() {
        if (!wsClose) {
            // Starte den Wiederverbindungsprozess nach 10 Sekunden
            setTimeout(() => {
                openWS(name, project);
            }, 10000);
        }
    });

    ws.on('error', (error: Error) => {
        setTimeout(() => {
            console.error(error);
        }, 2000);
    });
}


export function closeWS(name: string, project: string) {
    wsClose = true;
    ws.send(buildUserMessage("userLeft", name, project));
    ws.close(1000, 'connection was closed by the user');
}

export function cursorMoved(pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string | undefined, project: string) {
    ws.send(buildCursorMovedMessage("cursorMoved", pathName, cursor, selectionEnd, name, project));
}

export function textReplaced(pathName: string, from: vscode.Position, to: vscode.Position, content: string, name: string | undefined, project: string) {
    ws.send(buildTextReplacedMessage("textReplaced", pathName, from, to, content, name, project));
}

export function sendChatMessage(msg: string, name: string | undefined, project: string | undefined) {
    ws.send(buildChatMessage("chatMsg", msg, name, project));
}

function handleMessage(msg: Message) {

    if (msg.operation === "userJoined") {
        let data: CursorMovedData = msg.data;
        userJoined(data.name);
        return;
    }

    if (msg.operation === "userLeft") {
        let data: CursorMovedData = msg.data;
        userLeft(data.name);
        return;
    }

    if (msg.operation === "activeUsers") {
        addActiveUsers(msg.data);
    }

    if (msg.operation === "cursorMoved") {
        let data: CursorMovedData = msg.data;
        markLine(data.pathName, data.cursor, data.selectionEnd, data.name, data.project);
        return;
    }
    if (msg.operation === "textReplaced") {
        let data: TextReplacedData = msg.data;
        if (getTextChangeQueue().length === 0) {
            getTextChangeQueue().push(data);
            workThroughTextQueue();
        } else {
            getTextChangeQueue().push(data);
        }
        return;
    }

    if (msg.operation === "chatMsg") {
        let data: ChatData = msg.data;
        getChatViewProvider().receivedMsg(data);
        return;
    }
}
