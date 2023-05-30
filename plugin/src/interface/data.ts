import * as vscode from 'vscode';

export interface Data {
    userId: string
    project: string
}

export interface CursorMovedData extends Data {
    pathName: string,
    cursor: vscode.Position;
    selectionEnd: vscode.Position;
}

export interface TextReplacedData extends Data {
    pathName: string,
    from: vscode.Position,
    to: vscode.Position,
    content: string
}

export interface ChatData extends Data {
    msg: string,
    time: Date
}

export interface DelKeyData extends Data {
    pathName: string,
    from: vscode.Position,
    delLinesCounter: number,
    delCharCounter: number
}
