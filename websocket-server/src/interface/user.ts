import WebSocket from 'ws';

export interface User {
    ws: WebSocket;
    name: string;
}
