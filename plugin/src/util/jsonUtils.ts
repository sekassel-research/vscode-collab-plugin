import * as vscode from "vscode";
import {Position} from '../interface/position';

export function buildUserMessage(operation: string, userId: string, project: string, userName?: string, userDisplayName?: string) {
    return JSON.stringify({operation, data: {userId, project, userName, userDisplayName}});
}

export function buildCursorMovedMessage(operation: string, pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, userId: string, project: string) {
    return JSON.stringify({operation, data: {pathName, cursor, selectionEnd, userId, project}});
}

export function buildSendTextReplacedMessage(operation: string, pathName: string, from: Position, to: Position, content: string, newLineIds: string[], userId: string, project: string) {
    return JSON.stringify({operation, data: {pathName, from, to, content, newLineIds, userId, project}});
}

export function buildChatMessage(operation: string, msg: string, userId: string, project: string) {
    return JSON.stringify({operation, data: {msg, userId, time: new Date(), project}});
}

export function buildSendFileMessage(operation: string, pathName: string, lineCount: number, userId: string, project: string) {
    return JSON.stringify({operation, data: {pathName, lineCount, userId, project}});
}
