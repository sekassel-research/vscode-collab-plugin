// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { closeWS, cursorMoved, openWS } from './ws';

//let nameTags = new Map<string,any>();

//let markers = new Map<string,any>();

//let selections = new Map<string,any>();

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
		console.log("cursor moved");
		let editor = vscode.window.activeTextEditor;
		if(editor){
			editor.document.fileName
			const lineNumber = editor.selection.active.line;
			const position = editor.selection.active.character;
			const fileName = editor.document.fileName.replace(/\\/g, '\\\\'); // umbau auf // weil sonnst das JSON nicht akzeptiert
			markLine(lineNumber,position,"Pascal");	// markiert aktuell den cursor und taggt "Pascal" | wird später für syncro benötigt
			cursorMoved(fileName,lineNumber,position,"Pascal","Test");
		}
	});

	vscode.workspace.onDidChangeTextDocument(() =>{ // wird aufgerufen wenn der Text geändert wird | muss sperre reinmachen wenn andere tippen | timeout ?
		console.log("changed text");
		let editor = vscode.window.activeTextEditor;
		if(editor){
			let lineNumber = editor.selection.active.line;
			let lineText = editor.document.lineAt(lineNumber).text;
			console.log(`Zeile: "${lineNumber} | Inhalt der aktuellen Zeile: "${lineText}"`);}
	});


	let disposable = vscode.commands.registerCommand('firstextention.testCommand', () => {
		vscode.window.showInformationMessage('Line: '+ vscode.window.activeTextEditor?.selection.active.line+ " | Position: "+ vscode.window.activeTextEditor?.selection.active.character );
	});

	context.subscriptions.push(disposable);
}

export function markLine(lineNumber: number,position:number, name: string): void {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
	  	let line = editor.document.lineAt(lineNumber);
	  	editor.setDecorations(nameTag,[line.range]);    // markiert ganze line damit NameTag am ende ist
		let currrentPosition = new vscode.Position(lineNumber, position);
		let markerPosition = {
			range: new vscode.Range(currrentPosition, currrentPosition),
		};
		editor.setDecorations(marker, [markerPosition]); // markiert Cursorposition in crimson
	}
  }

export function deactivate() {
	return new Promise(resolve => {
		closeWS("Pascal","Test");
	});
}
