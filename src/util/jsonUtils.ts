import * as vscode from 'vscode';

export function buildUserMessage(operation: string, name: string, project: string) {
    return `{"operation":"${operation}","data":{"name":"${name}","project":"${project}"}}`;
}

export function buildCursorMovedMessage(pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string, project: string) {
    return `{"operation":"cursorMoved","data":{"pathName":"${pathName}","cursor":${JSON.stringify(cursor)},"selectionEnd":${JSON.stringify(selectionEnd)},
    "name":"${name}", "project":"${project}"}}`;
}

export function buildTextReplacedMessage(pathName: string, fromLine: number, fromPosition: number, toLine: number, toPosition: number, content: string, name: string, project: string) {
    return `{"operation":"textReplaced","data":{"pathName":"${pathName}","fromLine":${fromLine},"fromPosition":${fromPosition},
    "toLine":${toLine},"toPosition":${toPosition},"content":"${content}","name":"${name}", "project":"${project}"}}`;
}
