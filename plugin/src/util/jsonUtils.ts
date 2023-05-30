import * as vscode from 'vscode';

export function buildUserMessage(operation: string, userId: string, project: string) {
    return JSON.stringify({operation, data: {name: userId, project}});
}

export function buildCursorMovedMessage(operation: string, pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string, project: string) {
    return JSON.stringify({operation, data: {pathName, cursor, selectionEnd, name, project}});
}

export function buildSendTextReplacedMessage(operation: string, pathName: string, from: vscode.Position, to: vscode.Position, content: string, name: string, project: string) {
    return JSON.stringify({operation, data: {pathName, from, to, content, name, project}});
}

export function buildChatMessage(operation: string, msg: string, name: string, project: string) {
    return JSON.stringify({operation, data: {msg, name, time: new Date(), project}});
}

export function buildSendTextDelKeyMessage(operation: string, pathName: string, from: vscode.Position, delLinesCounter: number, delCharCounter: number, name: string, project: string) {
    return JSON.stringify({operation, data: {pathName, from, delLinesCounter, delCharCounter, name, project}});
}
