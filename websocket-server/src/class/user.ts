import WebSocket from 'ws';

export class User{

    private ws;
    private name;

    constructor(name:String,ws:WebSocket) {
        this.name= name;
        this.ws = ws;
    }

    public getName(){
        return this.name;
    }

    public getWs(){
        return this.ws;
    }

}
