// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {User} from './class/user';
import {closeWS, cursorMoved, openWS, textReplaced} from './ws';
import {ChatViewProvider} from './class/chatViewProvider'

const users = new Map<string, User>();

let username = process.env.username;
let project = process.env.projectId;


export function activate(context: vscode.ExtensionContext) {
    console.log("init");

    if (!username) {
        username = "User";
    }
    if (!project) {
        project = "Test";
    }

    openWS(username, project);

    const provider = new ChatViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, provider));

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
        cursorMoved(pathName, cursor, selectionEnd, "Pascal", "Test");
    });

    vscode.workspace.onDidChangeTextDocument(changes => { // wird aufgerufen, wenn der Text geändert wird | muss Sperre reinmachen, wenn andere tippen | timeout?
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        for (let change of changes.contentChanges) {
            let pathName = pathString(editor.document.fileName);
            let range = change.range;
            let content = jsonString(change.text);
            console.log(`Text replaced from ${range.start.line + 1}:${range.start.character} to ${range.end.line + 1}:${range.end.character}`);

            textReplaced(pathName, range, content, "Pascal", "Test");
        }
    });


    let disposable = vscode.commands.registerCommand('firstextention.testCommand', () => {
        vscode.window.showInformationMessage('Line: ' + vscode.window.activeTextEditor?.selection.active.line + " | Position: " + vscode.window.activeTextEditor?.selection.active.character);
    });

    context.subscriptions.push(disposable);
}

//function getUserName() {
//	return process.env.userName;
//}

//function getProjectId(){
//	return process.env.projectId;
//}

export function userJoined(name: string) {
    users.set(name, new User(name));
    vscode.window.setStatusBarMessage("User: " + name + " joined", 5000);
}

export function userLeft(name: string) {
    if (users.has(name)) {
        removeMarking(users.get(name));
        users.delete(name);
        vscode.window.setStatusBarMessage("User: " + name + " left", 5000);
    }
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
    console.log("markLine called");
    let editor = vscode.window.activeTextEditor;
    let user = users.get(name);
    if (!editor || relPath(editor.document.fileName) !== pathName || !user) {
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

export function replaceText(pathName: string, range: vscode.Range, content: string, name: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || pathName !== relPath(editor.document.fileName) || !users.has(name)) {
        return;
    }
    const edit = new vscode.WorkspaceEdit();

    edit.replace(editor.document.uri, range, content);
    vscode.workspace.applyEdit(edit);
}

function jsonString(content: string) {
    return content.replace(/\\/g, '\\\\').replace(/\n/g, "\\n").replace(/"/g, '\\"');
}

function pathString(path: string) {
    path = relPath(path);
    return path.replace(/\\/g, '\\\\');
}

function relPath(path: string) {
    const projectRoot = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
    if (projectRoot) {
        path = path.replace(projectRoot, '');
    }
    return path;
}

export function deactivate() {
    return new Promise(() => {
        if (!username || !project) {
            return;
        }
        closeWS(username, project);
    });
}

export function log(msg:any){
    console.log(msg);
}