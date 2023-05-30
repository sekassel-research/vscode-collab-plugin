import WebSocket, {WebSocketServer} from 'ws';
import {Message} from "./interface/message";
import {Data} from "./interface/data";
import {User} from "./interface/user";

const wss = new WebSocketServer({
    port: +(process.env.PORT || 8080),
    path: process.env.WS_PATH,
});
const rooms = new Map<string, Set<User>>();

const msgOperations = ["userLeft", "cursorMoved", "chatMsg", "textReplaced", "getCursors", "delKey"]

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
        console.log(`Verbindung geschlossen: Code ${code}, Grund: ${reason}`);
    });
});

wss.on('error', (error) => {
    console.log(`Error: ${error}`);
});


function handleMessage(msg: Message, ws: WebSocket) {
    if (msg.operation == "userJoined") {
        broadcastMessage(msg, ws);
        return sendUserList(msg, ws);
    }
    if (msgOperations.includes(msg.operation)) {
        return broadcastMessage(msg, ws);
    }
    console.error('unhandled message: %s', msg)
}

function sendUserList(msg: Message, ws: WebSocket) {
    let data: Data = msg.data;
    let project = data.project;
    let users = rooms.get(project);
    let userNames = [];

    if (users) {
        for (const user of users) {
            userNames.push(user.name);
        }
    }
    ws.send(JSON.stringify({operation: "activeUsers", data: userNames}))
}

function broadcastMessage(msg: Message, ws: WebSocket) {
    let data: Data = msg.data;
    let project = data.project;
    let name = data.name;
    checkForRoom(project, name, ws);

    msg.time = new Date().getTime();

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    })
}

function checkForRoom(project: string, name: string, ws: WebSocket) {
    let room = rooms.get(project);
    if (!room) {
        room = new Set<User>();
        rooms.set(project, room)
    }
    room.add({name, ws});
}

function removeWs(ws: WebSocket) {
    for (const key of rooms.keys()) {
        const room = rooms.get(key)
        if (room) {
            for (const user of room) {
                if (user.ws === ws) {
                    room.delete(user);
                }
            }

            if (room.size == 0) {
                rooms.delete(key);
            }
        }
    }
}
