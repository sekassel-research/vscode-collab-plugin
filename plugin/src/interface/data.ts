import * as vscode from 'vscode';
import { Position } from './position';

export interface Data {
    userId: string
    project: string
}

export interface UserJoinedData extends Data {
    userName: string
    userDisplayName: string
}

export interface CursorMovedData extends Data {
    pathName: string,
    cursor: vscode.Position;
    selectionEnd: vscode.Position;
}

export interface TextReplacedData extends Data {
    pathName: string,
    from: Position
    to: Position
    content: string
}

export interface ChatData extends Data {
    msg: string,
    time: Date
}

export interface DelKeyData extends Data {
    pathName: string,
    from: {
        line:string,
        character:number
    }
    delLinesCounter: number,
    delCharCounter: number
}

export interface IdArrayData extends Data {
    pathName: string,
    idArray: [string],
}