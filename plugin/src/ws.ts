import * as vscode from "vscode";
import {
    addActiveUsers,
    clearUsers,
    getChatViewProvider,
    getFile,
    getProjectId,
    getReceivedDocumentChanges,
    getUserDisplayName,
    getUserId,
    getUserName,
    markLine,
    onActiveEditor,
    sendCurrentCursor,
    updateIdArray,
    userJoined,
    userLeft,
} from "./extension";
import {
    ChatData,
    CursorMovedData,
    Data,
    IdArrayData,
    TextReplacedData,
    UserJoinedData
} from "./interface/data";
import {Message} from "./interface/message";
import {
    buildChatMessage,
    buildCursorMovedMessage,
    buildSendFileMessage,
    buildSendTextReplacedMessage,
    buildUserMessage
} from "./util/jsonUtils";
import {Position} from "./interface/position";

const webSocket = require("ws");

let wsAddress = vscode.workspace.getConfiguration("vscode-collab").get<string>("ws-address") ?? "ws://localhost:8080";

let ws: any = null;
let wsClose = false;


export function openWS(userId: string, userName: string, userDisplayName: string, project: string) {
    ws = new webSocket(wsAddress);
    ws.on("open", function open() {
        ws.on("message", function incoming(data: any) {
            const msg: Message = JSON.parse(Buffer.from(data).toString());
            console.log(msg);
            handleMessage(msg);
        });

        ws.send(buildUserMessage("userJoined", userId, project, userName, userDisplayName));
        onActiveEditor();
    });

    ws.on("close", function close() {
        if (!wsClose) {
            // tries to reconnect after 10 seconds
            clearUsers();
            setTimeout(() => {
                openWS(userId, userName, userDisplayName, project);
            }, 10000);
        }
    });

    ws.on("error", (error: Error) => {
        clearUsers();
        setTimeout(() => {
            console.error(error);
        }, 2000);
    });
}

export function closeWS(userId: string, project: string) {
    wsClose = true;
    ws.send(buildUserMessage("userLeft", userId, project));
    ws.close(1000, "connection was closed by the user");
}

export function cursorMoved(pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, userId: string, project: string) {
    ws.send(buildCursorMovedMessage("cursorMoved", pathName, cursor, selectionEnd, userId, project));
}

export function sendTextReplaced(pathName: string, from: Position, to: Position, content: string, newLineIds: string[], userId: string, project: string) {
    ws.send(buildSendTextReplacedMessage("textReplaced", pathName, from, to, content, newLineIds, userId, project));
}

export function sendChatMessage(msg: string, userId: string, project: string) {
    ws.send(buildChatMessage("chatMsg", msg, userId, project));
}

export function getCursors(userId: string, project: string) {
    ws.send(buildUserMessage("getCursors", userId, project));
}

export function sendFile(pathName: string, lineCount: number, userId: string, project: string) {
    ws.send(buildSendFileMessage("sendFile", pathName, lineCount, userId, project));
}

function handleMessage(msg: Message) {
    switch (msg.operation) {
        case "userJoined":
            const userJoinedData: UserJoinedData = msg.data;
            userJoined(userJoinedData.userId, userJoinedData.userName, userJoinedData.userDisplayName);
            break;
        case "userLeft":
            const userLeftData: Data = msg.data;
            userLeft(userLeftData.userId);
            break;
        case "activeUsers":
            addActiveUsers(msg.data);
            break;
        case "cursorMoved":
            const cursorMovedData: CursorMovedData = msg.data;
            markLine(cursorMovedData.pathName, cursorMovedData.cursor, cursorMovedData.selectionEnd, cursorMovedData.userId);
            break;
        case "textReplaced":
            const textReplacedData: TextReplacedData = msg.data;
            getReceivedDocumentChanges().next(textReplacedData);
            break;
        case "getCursors":
            const getCursorData: Data = msg.data;
            sendCurrentCursor(getCursorData.userId);
            break;
        case "chatMsg":
            const chatData: ChatData = msg.data;
            getChatViewProvider().receivedMsg(chatData);
            break;
        case "sendFile":
            getFile();
            break;
        case "idArray":
            const idArrayData: IdArrayData = msg.data;
            console.log("msg.data:", msg.data);
            updateIdArray(idArrayData.pathName, idArrayData.idArray);
            break;
        default:
            console.error("Unknown operation: " + msg.operation);
    }
}

export function updateWS(newWsAddress: string) {
    wsAddress = newWsAddress;
    const userId = getUserId();
    const userName = getUserName();
    const userDisplayName = getUserDisplayName();
    const projectId = getProjectId();
    closeWS(userId, projectId);
    openWS(userId, userName, userDisplayName, projectId);
}

