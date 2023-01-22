import * as vscode from 'vscode';

export function buildUserMessage(operation: string, name: string, project: string) {
    return JSON.stringify({operation, data: {name, project}});
}

export function buildCursorMovedMessage(operation: string, pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string, project: string) {
    return JSON.stringify({operation, data: {pathName, cursor, selectionEnd, name, project}})
}

export function buildTextReplacedMessage(operation: string, pathName: string, range: vscode.Range, content: string, name: string, project: string) {
    return JSON.stringify({operation, data: {pathName, range, content, name, project}})
}

export function buildChatMessage(operation: string, msg: string, name: string | undefined, project: string | undefined) {
    return JSON.stringify({operation, data: {msg, name, time: new Date().getTime(), project}})
}
