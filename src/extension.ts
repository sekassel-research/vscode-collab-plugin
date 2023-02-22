// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {User} from './class/user';
import {closeWS, cursorMoved, openWS, textReplaced} from './ws';
import {ChatViewProvider} from './class/chatViewProvider';
import {ActiveUsersProvider} from './class/activeUsersProvider';
import { randomUUID } from 'crypto';

const users = new Map<string, User>();
let chatViewProvider: ChatViewProvider;
let activeUsersProvider: ActiveUsersProvider;

let username = process.env.username;
let project = process.env.projectId;
let textEdits: string[] = [];


export async function activate(context: vscode.ExtensionContext) {
    console.log("init");
    

    username = await initUserName();
    console.log("username",username)
    if (username===undefined){
        username = "User"+randomUUID();
    }
    if (!project) {
        project = "Default";
    }
    vscode.window.showInformationMessage("username , "+ username);
    openWS(username, project);

    chatViewProvider = new ChatViewProvider(context.extensionUri);

    activeUsersProvider = new ActiveUsersProvider(users);
    vscode.window.createTreeView('vscode-collab-activeUsers', {treeDataProvider: activeUsersProvider});

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatViewProvider));

    vscode.window.onDidChangeTextEditorSelection(() => { // wird aufgerufen, wenn cursorposition sich ändert
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
        //markLine(lineNumber,position,"Pascal");	// markiert aktuell den cursor und taggt "Pascal" | wird später für syncro benötigt
        cursorMoved(pathName, cursor, selectionEnd, username, "Test");
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
            console.log(`Text replaced from ${range.start.line + 1}:${range.start.character} to ${range.end.line + 1}:${range.end.character}`);
            let uri = editor.document.uri;

            let ownText = true;
            textEdits.filter((edit,index) => {
                if (edit === JSON.stringify({uri,range,content})){
                    ownText = false;
                    textEdits.splice(index,1);
                }
            });
            if (ownText){
                console.log("yes sir")
                textReplaced(pathName, range.start, range.end, content, username, "Test");
            }
        }
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

export function addActiveUsers(data:[]) {
    for (const userName of data){
        console.log(userName);
        users.set(userName,new User(userName));
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

export function markLine(pathName: string, cursor: vscode.Position, selectionEnd: vscode.Position, name: string, project: string) {
    let editor = vscode.window.activeTextEditor;
    let user = users.get(name);
    if (!editor || !user || name === username) { //|| pathName.replace("\\","/") !== pathString(editor.document.fileName).replace("\\","/") 
        return;
    }
    let line = editor.document.lineAt(cursor.line);

    editor.setDecorations(user.getColorIndicator(), [line.range]);
    editor.setDecorations(user.getNameTag(), [line.range]);    // markiert ganze line damit NameTag am Ende ist

    let selection = new vscode.Range(cursor, selectionEnd);
    editor.setDecorations(user.getSelection(), [selection]);   // markiert textauswahl in 66% crimson

    let markerPosition = {
        range: new vscode.Range(cursor, cursor),
    };
    editor.setDecorations(user.getCursor(), [markerPosition]); // markiert Cursorposition in crimson
}

export function replaceText(pathName: string, from: vscode.Position, to: vscode.Position, content: string, name: string) {
    const editor = vscode.window.activeTextEditor;

    let user = users.get(name);
    if (!editor || !user || name === username ) { //|| pathName.replace("\\","/") !== pathString(editor.document.fileName).replace("\\","/")
        return;
    }
    const edit = new vscode.WorkspaceEdit();
    edit.replace(editor.document.uri, new vscode.Range(from, to), content);
    textEdits.push(JSON.stringify({uri:editor.document.uri,range: new vscode.Range(from, to), content}));
    vscode.workspace.applyEdit(edit);

    let line = editor.document.lineAt(to.line);

    editor.setDecorations(user.getColorIndicator(), [line.range]);
    editor.setDecorations(user.getNameTag(), [line.range]);  
}

function pathString(path: string) {
    const projectRoot = vscode.workspace.rootPath;
    if (projectRoot) {
        path = path.replace(projectRoot, '');
    }
    return path;
}

async function initUserName(): Promise<string | undefined> {
    return process.env.username;
}

export function getUsers() {
    return users;
}

export function getUserName() {
    return username;
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

export function log(msg: any) {
    console.log(msg);
}
