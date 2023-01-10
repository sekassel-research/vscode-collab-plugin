// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {closeWS, cursorMoved, openWS, textAdded, textReplaced} from './ws';

//const users = new Map<string,Set<any>>();

//map.get()

let nameTag = vscode.window.createTextEditorDecorationType({
    after: {
        margin: "0 0 0 3em",
        contentText: 'Pascal',
    }
});

let selection = vscode.window.createTextEditorDecorationType({
    backgroundColor: '#dc143c66',
});


let marker = vscode.window.createTextEditorDecorationType({
    border: '1px solid crimson',
});


export function activate(context: vscode.ExtensionContext) {
    console.log("init");
    openWS("Pascal", "Test");

    vscode.window.onDidChangeTextEditorSelection(() => { // wird aufgerufen, wenn cursorposition sich ändert
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const lineNumber = editor.selection.active.line;
            const position = editor.selection.active.character;
            const pathName = pathString(editor.document.fileName);
            let selectionLine = editor.selection.end.line;
            let selectionPosition = editor.selection.end.character;

            if (editor.selection.active === editor.selection.end) { // flippt wenn cursor ist am ende der Markierung
                selectionLine = editor.selection.start.line;
                selectionPosition = editor.selection.start.character;
            }
            //markLine(lineNumber,position,"Pascal");	// markiert aktuell den cursor und taggt "Pascal" | wird später für syncro benötigt
            cursorMoved(pathName, lineNumber, position, selectionLine, selectionPosition, "Pascal", "Test");
        }
    });

    vscode.workspace.onDidChangeTextDocument(changes => { // wird aufgerufen, wenn der Text geändert wird | muss Sperre reinmachen, wenn andere tippen | timeout?
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            for (const change of changes.contentChanges) {
                const pathName = pathString(editor.document.fileName);
                const fromLine = change.range.start.line;
                const fromPos = change.range.start.character;
                const content = jsonString(change.text);

                if (change.range.isEmpty) {
                    console.log(`Text added at ${fromLine + 1}:${fromPos} Text:`, content);

                    textAdded(pathName, fromLine, fromPos, content, "Pascal", "Test");
                } else {
                    const toLine = change.range.end.line;
                    const toPos = change.range.end.character;
                    console.log(`Text removed from ${fromLine + 1}:${fromPos} to ${toLine + 1}:${toPos}`);

                    textReplaced(pathName, fromLine, fromPos, toLine, toPos, content, "Pascal", "Test");
                }
            }
        }
    });


    let disposable = vscode.commands.registerCommand('firstextention.testCommand', () => {
        vscode.window.showInformationMessage('Line: ' + vscode.window.activeTextEditor?.selection.active.line + " | Position: " + vscode.window.activeTextEditor?.selection.active.character);
    });

    context.subscriptions.push(disposable);
}

export function markLine(pathName: string, lineNumber: number, position: number, selectionStart: number, selectionEnd: number, name: string): void {
    console.log("markLine called");
    const editor = vscode.window.activeTextEditor;
    if (!editor || relPath(editor.document.fileName) !== pathName) {
        return;
    }
    const line = editor.document.lineAt(lineNumber);
    editor.setDecorations(nameTag, [line.range]);    // markiert ganze line damit NameTag am Ende ist

    let selectionPosition = new vscode.Range(new vscode.Position(lineNumber, selectionStart), new vscode.Position(lineNumber, selectionEnd));
    editor.setDecorations(selection, [selectionPosition]);   // markiert textauswahl in 66% crimson

    let currrentPosition = new vscode.Position(lineNumber, position);
    let markerPosition = {
        range: new vscode.Range(currrentPosition, currrentPosition),
    };
    editor.setDecorations(marker, [markerPosition]); // markiert Cursorposition in crimson
}

// cursor position | ersetzt aktuell ganze Zeile / zwar sicherer als Zeichen löschen aber halt Cursor
export function addText(pathName: string, lineNumber: number, position: number, name: string, content: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || pathName !== relPath(editor.document.fileName)) {
        return;
    }
    const edit = new vscode.WorkspaceEdit();
    edit.insert(editor.document.uri, new vscode.Position(lineNumber, position), content);
    vscode.workspace.applyEdit(edit);
}

export function replaceText(pathName: string, fromLine: number, fromPosition: number, toLine: number, toPosition: number, content: string, name: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || pathName !== relPath(editor.document.fileName)) {
        return;
    }
    const edit = new vscode.WorkspaceEdit();
    const from = new vscode.Position(fromLine, fromPosition);
    const to = new vscode.Position(toLine, toPosition);


    edit.replace(editor.document.uri, new vscode.Range(from, to), content);
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
    const projectRoot = vscode.workspace.rootPath;
    if (projectRoot) {
        path = path.replace(projectRoot, '');
    }
    return path;
}

export function deactivate() {
    return new Promise(() => {
        closeWS("Pascal", "Test");
    });
}
