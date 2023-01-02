// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { closeWS, cursorMoved, openWS } from './ws';

// to get current line: 	vscode.window.activeTextEditor?.selection.active.line
// to get current char pos: vscode.window.activeTextEditor?.selection.active.character

//let nameTags = new Map<string,any>();

//let markers = new Map<string,any>();

//let selections = new Map<string,any>();

//map.get()

let nameTag = vscode.window.createTextEditorDecorationType({after:{		// label kann ich nur davor oder danach platzieren :( vielleicht popup ?
    margin:"0 0 0 3em",
	contentText: 'Pascal',
  }});

let marker = vscode.window.createTextEditorDecorationType({
	//backgroundColor: 'solid yellow',		funktioniert nicht
	border: '1px solid crimson',
});

  // speicher um verschiedene farben abzulegen ?

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
			const fileName = editor.document.fileName.replace(/\\/g, '\\\\');
			markLine(lineNumber,position,"Pascal");	// markiert aktuell den cursor und taggt "Pascal" | wird später für syncro benötigt
			cursorMoved(fileName,lineNumber,position,"Pascal","Test");
		}
	});

	vscode.workspace.onDidChangeTextDocument(() =>{ // wird aufgerufen wenn der Text geändert wird | muss sperre reinmachen wenn andere tippen timeout ?
		console.log("changed text");
		let editor = vscode.window.activeTextEditor;
		if(editor){
			let lineNumber = editor.selection.active.line;
			let lineText = editor.document.lineAt(lineNumber).text;
			console.log(`Zeile: "${lineNumber} | Inhalt der aktuellen Zeile: "${lineText}"`);}
	});
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('firstextention.testCommand', () => { //infobox for otheruser joined/leaved ?
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
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
		editor.setDecorations(marker, [markerPosition]); // markiert Cursorposition in Gelb
	}
  }

// This method is called when your extension is deactivated
export function deactivate() {
	return new Promise(resolve => {
		closeWS("Pascal","Test");
	});
}
