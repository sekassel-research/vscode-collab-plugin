import * as vscode from 'vscode';

export function buildUserMessage(operation: string, userId: string, project: string) {
    return JSON.stringify({operation, data: {userId: userId, project}});
}

export function buildCursorMovedMessage(operation: string, pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, userId: string, project: string) {
    return JSON.stringify({operation, data: {pathName, cursor, selectionEnd, userId, project}});
}

export function buildSendTextReplacedMessage(operation: string, pathName: string, from: vscode.Position, to: vscode.Position, content: string, userId: string, project: string) {
    return JSON.stringify({operation, data: {pathName, from, to, content, userId, project}});
}

export function buildChatMessage(operation: string, msg: string, userId: string, project: string) {
    return JSON.stringify({operation, data: {msg, userId, time: new Date(), project}});
}

export function buildSendTextDelKeyMessage(operation: string, pathName: string, from: vscode.Position, delLinesCounter: number, delCharCounter: number, userId: string, project: string) {
    return JSON.stringify({operation, data: {pathName, from, delLinesCounter, delCharCounter, userId, project}});
}
