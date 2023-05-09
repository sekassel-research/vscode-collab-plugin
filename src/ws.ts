import * as vscode from 'vscode';
import {
    addActiveUsers,
    clearUsers,
    delkeyDelete,
    getChatViewProvider,
    getTextChangeQueue,
    getTextReceivedQueueProcessing,
    markLine,
    sendCurrentCursor,
    userJoined,
    userLeft,
    workThroughReceivedTextQueue,
} from "./extension";
import {ChatData, CursorMovedData, Data, DelKeyData, TextReplacedData} from "./interface/data";
import {Message} from "./interface/message";
import {
    buildChatMessage,
    buildCursorMovedMessage,
    buildSendTextDelKeyMessage,
    buildSendTextReplacedMessage,
    buildUserMessage
} from "./util/jsonUtils";

const webSocket = require('ws');

let ws = new webSocket('ws://192.168.178.159:8080');
let wsClose = false;


export function openWS(name: string, project: string) {
    ws = new webSocket('ws://192.168.178.159:8080');
    ws.on('open', function open() {

        ws.on('message', function incoming(data: any) {
            const msg: Message = JSON.parse(Buffer.from(data).toString());
            handleMessage(msg);
        });

        ws.send(buildUserMessage("userJoined", name, project));
        getCursors(name, project);
    });

    ws.on('close', function close() {
        if (!wsClose) {
            // Starte den Wiederverbindungsprozess nach 10 Sekunden
            clearUsers();
            setTimeout(() => {
                openWS(name, project);
            }, 10000);
        }
    });

    ws.on('error', (error: Error) => {
        clearUsers();
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

export function cursorMoved(pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string, project: string) {
    ws.send(buildCursorMovedMessage("cursorMoved", pathName, cursor, selectionEnd, name, project));
}

export function sendTextReplaced(pathName: string, from: vscode.Position, to: vscode.Position, content: string, name: string, project: string) {
    ws.send(buildSendTextReplacedMessage("textReplaced", pathName, from, to, content, name, project));
}

export function sendChatMessage(msg: string, name: string, project: string) {
    ws.send(buildChatMessage("chatMsg", msg, name, project));
}

export function getCursors(name: string, project: string) {
    ws.send(buildUserMessage("getCursors", name, project));
}

export function sendTextDelKey(pathName: string, from: vscode.Position, delKeyCounter: number, name: string, project: string) {
    ws.send(buildSendTextDelKeyMessage("delKey", pathName, from, delKeyCounter, name, project));
}

function handleMessage(msg: Message) {
    switch (msg.operation) {
        case "userJoined":
            let userJoinedData: Data = msg.data;
            userJoined(userJoinedData.name);
            break;
        case "userLeft":
            let userLeftData: Data = msg.data;
            userLeft(userLeftData.name);
            break;
        case "activeUsers":
            addActiveUsers(msg.data);
            break;
        case "cursorMoved":
            let cursorMovedData: CursorMovedData = msg.data;
            markLine(cursorMovedData.pathName, cursorMovedData.cursor, cursorMovedData.selectionEnd, cursorMovedData.name);
            break;
        case "textReplaced":
            let textReplacedData: TextReplacedData = msg.data;
            getTextChangeQueue().push(textReplacedData);
            if (!getTextReceivedQueueProcessing()) {
                workThroughReceivedTextQueue();
            }
            break;
        case "getCursors":
            sendCurrentCursor();
            break;
        case "chatMsg":
            let chatData: ChatData = msg.data;
            getChatViewProvider().receivedMsg(chatData);
            break;
        case "delKey":
            let delKeyData: DelKeyData = msg.data;
            delkeyDelete(delKeyData.pathName, delKeyData.from, delKeyData.delKeyCounter, delKeyData.name);
            break;
        default:
            console.error("Unknown operation: " + msg.operation);
    }
}
