import WebSocket, {WebSocketServer} from 'ws';
import {message} from "./interface/message";
import {data} from "./interface/data";
import {User} from "./class/user";

const wss = new WebSocketServer({port: 8080,});
const rooms = new Map<string, Set<User>>();

const msgOperations = ["userLeft", "cursorMoved", "chatMsg", "textReplaced", "getCursors", "delKey"]


wss.on('connection', function connection(ws) {
    ws.on('message', (data: any) => {
        console.log(Buffer.from(data).toString()+"\n");
        const msg: message = JSON.parse(Buffer.from(data).toString());
        handleMessage(msg, ws);
    });

    ws.on('close', (code, reason) => {
        removeWs(ws);
        console.log(`Verbindung geschlossen: Code ${code}, Grund: ${reason}`);
    });
});

wss.on('error', (error) => {
    console.log(`Error: ${error}`);
});


function handleMessage(msg: message, ws: WebSocket) {
    if (msg.operation == "userJoined") {
        broadcastMessage(msg, ws);
        return sendUserList(msg, ws);
    }
    if (msgOperations.includes(msg.operation)) {
        return broadcastMessage(msg, ws);
    }
    console.error('unhandled message: %s', msg)
}

function sendUserList(msg: message, ws: WebSocket) {
    let data: data = msg.data;
    let project = data.project;
    let users = rooms.get(project);
    let userNames = [];

    if (users) {
        for (const user of users) {
            userNames.push(user.getName());
        }
    }
    ws.send(JSON.stringify({operation: "activeUsers", data: userNames}))
}

function broadcastMessage(msg: message, ws: WebSocket) {
    let data: data = msg.data;
    let project = data.project;
    let name = data.name;
    checkForRoom(project, name, ws);

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    })
}

function checkForRoom(project: string, name: string, ws: WebSocket) {
    if (!rooms.get(project)) {
        rooms.set(project, new Set())
    }
    // @ts-ignore
    rooms.get(project).add(new User(name, ws));
}

function removeWs(ws: WebSocket) {
    for (const key of rooms.keys()) {
        const room = rooms.get(key)
        if (room){
            for (const user of room) {
                if (user.getWs() === ws) {
                    room.delete(user);
                }
            }
    
            if (room.size == 0) {
                rooms.delete(key);
            }
        }
    }
}
