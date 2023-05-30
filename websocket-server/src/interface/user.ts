import WebSocket from 'ws';

export interface User {
    ws: WebSocket;
    userId: string;
}
