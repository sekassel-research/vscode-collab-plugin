// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// to get current line: 	vscode.window.activeTextEditor?.selection.active.line
// to get current char pos: vscode.window.activeTextEditor?.selection.active.character

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let nameTag = vscode.window.createTextEditorDecorationType({after:{		// label kann ich nur davor oder danach platzieren :( vielleicht popup ?
    margin:"0 0 0 3em",
	contentText: 'Pascal',
  }});

let marker = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'solid yellow',
	border: '1px solid yellow',
});

  // need some kind of storage for all init colours of users

export function activate(context: vscode.ExtensionContext) {
	console.log("init");

	vscode.window.onDidChangeTextEditorSelection(()=>{ // calls function if a textcursor gets moved
		console.log("cursor moved");
		let editor = vscode.window.activeTextEditor;
		if(editor){
			let lineNumber = editor.selection.active.line;
			let position = editor.selection.active.character;
			markLine(lineNumber,position,"Pascal");	//marks line for myself atm
		}
	});

	vscode.workspace.onDidChangeTextDocument(() =>{ // calls function if text gets edited
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
	  	editor.setDecorations(nameTag,[line.range]);
		let currrentPosition = new vscode.Position(lineNumber, position)
		let markerPosition = {
			range: new vscode.Range(currrentPosition, currrentPosition),
		};
		editor.setDecorations(marker, [markerPosition]);
	}
  }

// This method is called when your extension is deactivated
export function deactivate() {}
