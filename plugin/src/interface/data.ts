import * as vscode from 'vscode';
import {Position} from './position';

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
    content: string,
    newLineIds: string[]
}

export interface ChatData extends Data {
    msg: string,
    time: Date
}

export interface IdArrayData extends Data {
    pathName: string,
    idArray: [string],
}
