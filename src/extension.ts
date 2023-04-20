// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {User} from './class/user';
import {closeWS, cursorMoved, getCursors, openWS, sendTextReplaced} from './ws';
import {ChatViewProvider} from './class/chatViewProvider';
import {ActiveUsersProvider} from './class/activeUsersProvider';
import {randomUUID} from 'crypto';
import {TextReplacedData} from './interface/data';

const users = new Map<string, User>();
let chatViewProvider: ChatViewProvider;
let activeUsersProvider: ActiveUsersProvider;

let username = "user_" + randomUUID();
let project = "global";
let textEdits: string[] = [];
let textChangeQueue: any[] = [];
let sendTextQueue: any[] = [];
let textQueueProcessing = false;
let blockCursorUpdate = false;


export async function activate(context: vscode.ExtensionContext) {
    await initUserName().then((envUsername) => {
        if (envUsername !== undefined) {
            username = envUsername;
        }
        console.log(username);
    });

    await initProjectName().then((envProject) => {
        if (envProject !== undefined) {
            project = envProject;
        }
        console.log(project);
    });


    vscode.window.showInformationMessage("username , " + username);
    openWS(username, project);

    chatViewProvider = new ChatViewProvider(context.extensionUri);

    activeUsersProvider = new ActiveUsersProvider(users);
    vscode.window.createTreeView('vscode-collab-activeUsers', {treeDataProvider: activeUsersProvider});

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatViewProvider));

    vscode.window.onDidChangeTextEditorSelection(() => { // wird aufgerufen, wenn cursorposition sich ändert
        if (blockCursorUpdate) {
            return;
        }
        sendCurrentCursor();
    });

    vscode.workspace.onDidChangeTextDocument(changes => { // wird aufgerufen, wenn der Text geändert wird | muss Sperre reinmachen, wenn andere tippen | timeout?
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        for (let change of changes.contentChanges) {
            let pathName = pathString(editor.document.fileName);
            let range = change.range;
            let content = change.text;
            let uri = editor.document.uri;

            let ownText = true;
            textEdits.filter((edit, index) => {
                const jsonContent: string = JSON.parse(edit).content;
                if (edit === JSON.stringify({uri, range, content}) || (jsonContent.includes(content))) {
                    ownText = false;
                    textEdits.splice(index, 1);
                }
            });
            if (ownText) {
                blockCursorUpdate = true;
                textReplaced(pathName, range.start, range.end, content, username, project);
                setTimeout(() => {
                    blockCursorUpdate = false;
                }, 100);
            }
        }
    });

    vscode.window.onDidChangeActiveTextEditor(() => {
        getCursors(username, project);
    });


    let disposable = vscode.commands.registerCommand('firstextention.testCommand', () => {
        vscode.window.showInformationMessage('Line: ' + vscode.window.activeTextEditor?.selection.active.line + " | Position: " + vscode.window.activeTextEditor?.selection.active.character);
    });

    context.subscriptions.push(disposable);
}

export function userJoined(name: string) {
    users.set(name, new User(name));
    vscode.window.setStatusBarMessage("User: " + name + " joined", 5000);
    activeUsersProvider.refresh();
}

export function userLeft(name: string) {
    if (users.has(name)) {
        removeMarking(users.get(name));
        users.delete(name);
        vscode.window.setStatusBarMessage("User: " + name + " left", 5000);
        activeUsersProvider.refresh();
    }
}

export function addActiveUsers(data: []) {
    for (const userName of data) {
        users.set(userName, new User(userName));
    }
    activeUsersProvider.refresh();
}

function removeMarking(user: User | undefined) {
    let editor = vscode.window.activeTextEditor;
    if (user && editor) {
        editor.setDecorations(user.getColorIndicator(), []);
        editor.setDecorations(user.getNameTag(), []);
        editor.setDecorations(user.getSelection(), []);
        editor.setDecorations(user.getCursor(), []);
    }
}

export function markLine(pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string) {
    let editor = vscode.window.activeTextEditor;
    let user = users.get(name);

    if (!editor || !user || name === username || pathName.replace("\\", "/") !== pathString(editor.document.fileName).replace("\\", "/")) {
        return;
    }
    let line = editor.document.lineAt(cursor.line);

    editor.setDecorations(user.getColorIndicator(), [line.range]);
    editor.setDecorations(user.getNameTag(), [line.range]);    // markiert ganze line damit NameTag am Ende ist

    let selection = new vscode.Range(cursor, selectionEnd);
    editor.setDecorations(user.getSelection(), [selection]);   // markiert textauswahl

    let markerPosition = {
        range: new vscode.Range(cursor, cursor),
    };
    editor.setDecorations(user.getCursor(), [markerPosition]); // markiert Cursorposition
}

export function workThroughTextQueue() {
    while (textChangeQueue.length !== 0) {
        let textOperation: TextReplacedData = textChangeQueue.shift();
        replaceText(textOperation.pathName, textOperation.from, textOperation.to, textOperation.content, textOperation.name);
    }
}

export function sendCurrentCursor() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    let cursor = editor.selection.active;
    let pathName = pathString(editor.document.fileName);
    let selectionEnd = editor.selection.end;

    if (cursor === selectionEnd) { // flippt wenn cursor ist am ende der Markierung
        selectionEnd = editor.selection.start;
    }
    cursorMoved(pathName, cursor, selectionEnd, username, project);
}

function textReplaced(pathName: string, start: vscode.Position, end: vscode.Position, content: string, username: string, project: string) {
    sendTextQueue.push([pathName, start, end, content, username, project]);

    if (!textQueueProcessing) {
        processSendTextQueue();
    }
}


function processSendTextQueue() {
    textQueueProcessing = true;

    setTimeout(() => {
        const message = sendTextQueue.shift();
        if (message) {
            sendTextReplaced(message[0], message[1], message[2], message[3], message[4], message[5]);
            processSendTextQueue();
        } else {
            textQueueProcessing = false;
        }
    }, 30);
}

export function replaceText(pathName: string, from: vscode.Position, to: vscode.Position, content: string, name: string) {
    const editor = vscode.window.activeTextEditor;
    let user = users.get(name);

    if (!editor || !user || name === username || pathName.replace("\\", "/") !== pathString(editor.document.fileName).replace("\\", "/")) {
        return;
    }
    const edit = new vscode.WorkspaceEdit();
    edit.replace(editor.document.uri, new vscode.Range(from, to), content);
    textEdits.push(JSON.stringify({uri: editor.document.uri, range: new vscode.Range(from, to), content}));
    vscode.workspace.applyEdit(edit).then(() => {
        console.log(content);
        if (!user) {
            return;
        }
        let cursorPosition = new vscode.Position(from.line, from.character + content.length);
        if (content.includes("\n")) {
            cursorPosition = new vscode.Position(to.line + content.length, 0);
        }
        markLine(pathName, cursorPosition, cursorPosition, name);
    });
}

function pathString(path: string) {
    const projectRoot = vscode.workspace.rootPath;
    if (projectRoot) {
        path = path.replace(projectRoot, '');
    }
    return path;
}

export function jumpToLine(lineNumber: number) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const range = editor.document.lineAt(lineNumber - 1).range;
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
    editor.selection = new vscode.Selection(range.start, range.end);
}

async function initUserName(): Promise<string | undefined> {
    return process.env.username;
}

async function initProjectName(): Promise<string | undefined> {
    return process.env.projectname;
}

export function getUsers() {
    return users;
}

export function getUserName() {
    return username;
}

export function getTextChangeQueue() {
    return textChangeQueue;
}

export function getProjectId() {
    return project;
}

export function getChatViewProvider() {
    return chatViewProvider;
}

export function deactivate() {
    return new Promise(() => {
        if (!username || !project) {
            return;
        }
        closeWS(username, project);
    });
}
