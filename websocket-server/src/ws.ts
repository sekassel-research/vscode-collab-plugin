import WebSocket, {WebSocketServer} from 'ws';
import {Message} from "./interface/message";
import {Data} from "./interface/data";
import {User} from "./interface/user";
import path from 'path';
import {randomUUID} from "crypto";

const crdsMap = new Map<string, []>

const wss = new WebSocketServer({
    port: +(process.env.PORT || 8080),
    path: process.env.WS_PATH,
});

const rooms = new Map<string, Set<User>>();

wss.on('listening', () => {
    console.log(`WebSocket server running on ws://localhost:${wss.options.port}.`);
});

wss.on('connection', function connection(ws) {
    ws.on('message', (data: any) => {
        console.log(Buffer.from(data).toString() + "\n");
        const msg: Message = JSON.parse(Buffer.from(data).toString());
        handleMessage(msg, ws);
    });

    ws.on('close', (code, reason) => {
        removeWs(ws);
        console.log(`Connection closed: code ${code}, reason: ${reason}`);
    });
});

wss.on('error', (error) => {
    console.log(`Error: ${error}`);
});

function handleMessage(msg: Message, ws: WebSocket) {
    switch (msg.operation) {
        case "userJoined":
            userJoined(msg, ws);
            broadcastMessage(msg);
            return sendUserList(msg, ws);
        case "userLeft":
        case "chatMsg":
        case "getCursors":
            return broadcastMessage(msg);
        case "cursorMoved":
        case "delKey":
            checkForFile(msg, ws);
            return broadcastMessage(msg);
        case "textReplaced":
            checkForFile(msg, ws);
            return broadcastMessage(msg);
        case "sendFile":
            createFileID(msg);
            break;
        default:
            console.error('unhandled message: %s', msg);
    }
}


function userJoined(msg: Message, ws: WebSocket) {
    let data: Data = msg.data;
    let project = data.project;
    let userId = data.userId;
    let userName = data.userName;
    let userDisplayName = data.userDisplayName;
    checkForRoom(project, userId, userName, userDisplayName, ws);
}

function sendUserList(msg: Message, ws: WebSocket) {
    let data: Data = msg.data;
    let project = data.project;
    let users = rooms.get(project);
    let userNames = [];

    if (users) {
        for (const user of users) {
            userNames.push({userId: user.userId, userName: user.userName, userDisplayName: user.userDisplayName});
        }
    }
    ws.send(JSON.stringify({operation: "activeUsers", data: userNames}))
}

function broadcastMessage(msg: Message) {
    msg.time = new Date().getTime();

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

function checkForRoom(project: string, userId: string, userName: string, userDisplayName: string, ws: WebSocket) {
    let room = rooms.get(project);
    if (!room) {
        room = new Set<User>();
        rooms.set(project, room)
    }
    room.add({userId: userId, userName: userName, userDisplayName: userDisplayName, ws});
}

function removeWs(ws: WebSocket) {
    for (const key of rooms.keys()) {
        const room = rooms.get(key)
        removeUser(room, key, ws)
    }
}

function removeUser(room: Set<User> | undefined, projectName: string, ws: WebSocket) {
    if (!room) {
        return
    }
    for (const user of room) {
        if (user.ws === ws) {
            room.delete(user);
        }
    }
    if (room.size == 0) {
        rooms.delete(projectName);
        // TODO Clear Array | Iterate over array and remove all Index which start with projectName
    }
}

async function checkForFile(msg: Message, ws: WebSocket) {
    const key = path.join(msg.data.project, msg.data.pathName);
    if (crdsMap.get(key)) {
        return;
    }
    crdsMap.set(key, [])
    sendFileRequest(ws)
}

function sendFileRequest(ws: WebSocket) {
    const msg = JSON.stringify({operation: "sendFile"});
    ws.send(msg);
}

function createFileID(msg: Message) {
    const project = msg.data.project;
    const pathName = msg.data.pathName
    const key = path.join(project, pathName);
    const idArray = msg.data.content.split("\n")
    for (let i = 0; i < idArray.length; i++) {
        idArray[i] = randomUUID();
    }
    sendIdArray(project, pathName, idArray);
}

function sendIdArray(pathName: string, project: string, idArray: []) {
    const msg: Message = {operation: "idArray", data: {pathName, project, idArray}, time: new Date().getTime()}
    broadcastMessage(msg);
}
