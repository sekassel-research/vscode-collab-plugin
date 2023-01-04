// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { closeWS, cursorMoved, openWS, textChanged } from './ws';

//const users = new Map<string,Set<any>>();

//map.get()

let nameTag = vscode.window.createTextEditorDecorationType({after:{
    margin:"0 0 0 3em",
	contentText: 'Pascal',
  }});

let marker = vscode.window.createTextEditorDecorationType({
	//backgroundColor: 'solid yellow',		funktioniert nicht
	border: '1px solid crimson',
});

export function activate(context: vscode.ExtensionContext) {
	console.log("init");
	openWS("Pascal","Test");

	vscode.window.onDidChangeTextEditorSelection(()=>{ // wird aufgerufen wenn cursorposition sich ändert
		const editor = vscode.window.activeTextEditor;
		if(editor){
			const lineNumber = editor.selection.active.line;
			const position = editor.selection.active.character;
			const pathName = pathToString(editor.document.fileName);
			//markLine(lineNumber,position,"Pascal");	// markiert aktuell den cursor und taggt "Pascal" | wird später für syncro benötigt
			cursorMoved(pathName,lineNumber,position,"Pascal","Test");
		}
	});

	vscode.workspace.onDidChangeTextDocument(() =>{ // wird aufgerufen wenn der Text geändert wird | muss sperre reinmachen wenn andere tippen | timeout ?
		let editor = vscode.window.activeTextEditor;
		if(editor){
			const lineNumber = editor.selection.active.line;
			const lineText = editor.document.lineAt(lineNumber).text;
			const pathName = pathToString(editor.document.fileName);
			console.log(`Zeile: "${lineNumber} | Inhalt der aktuellen Zeile: "${lineText}"`);
			textChanged(pathName,lineNumber,lineText,"Pascal","Test");
		}
	});




	let disposable = vscode.commands.registerCommand('firstextention.testCommand', () => {
		vscode.window.showInformationMessage('Line: '+ vscode.window.activeTextEditor?.selection.active.line+ " | Position: "+ vscode.window.activeTextEditor?.selection.active.character );
	});

	context.subscriptions.push(disposable);
}

export function markLine(pathName:string,lineNumber: number,position:number, name: string): void {
	console.log("markLine called");
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const pathString = editor.document.fileName;
		if(pathString === pathName){
			const line = editor.document.lineAt(lineNumber);
			editor.setDecorations(nameTag,[line.range]);    // markiert ganze line damit NameTag am ende ist
			let currrentPosition = new vscode.Position(lineNumber, position);
			let markerPosition = {
				range: new vscode.Range(currrentPosition, currrentPosition),
			};
			editor.setDecorations(marker, [markerPosition]); // markiert Cursorposition in crimson
		};
	};
  }

  // cursor position | ersetzt aktuell ganze zeile / zwar sicherer als zeichen löschen aber halt cursor
export function changeLine(pathName:string,lineNumber: number, name:string,content:string){
	const editor = vscode.window.activeTextEditor;
	if (!editor || pathName!== pathToString(editor.document.fileName)) {
		return ;
	}
	const edit = new vscode.WorkspaceEdit();
	const line = editor.document.lineAt(lineNumber);
	const cursorPosition = editor.selection.active;

	edit.replace(editor.document.uri, new vscode.Range(line.range.start, line.range.end), content);
	vscode.workspace.applyEdit(edit);

	if (cursorPosition.character <= content.length) {
		editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
	} else {
		editor.selection = new vscode.Selection(line.range.start.line, content.length, line.range.start.line, content.length);
	}
}

function pathToString(path:string){
	return path.replace(/\\/g, '\\\\');
}

export function deactivate() {
	return new Promise(resolve => {
		closeWS("Pascal","Test");
	});
}
