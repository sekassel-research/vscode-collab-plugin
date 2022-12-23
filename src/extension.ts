// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// to get current line: 	vscode.window.activeTextEditor?.selection.active.line
// to get current char pos: vscode.window.activeTextEditor?.selection.active.character

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let color = vscode.window.createTextEditorDecorationType({after:{		// label kann ich nur davor oder danach platzieren :( vielleicht popup ?
    contentText: 'Pascal	',
    backgroundColor: "#FDFD9666"
  },backgroundColor: "#FDFD9666"});



// need some kind of storage for all init colours of users

export function activate(context: vscode.ExtensionContext) {
	console.log("init");

	vscode.window.onDidChangeTextEditorSelection(()=>{ // calls function if textcursor gets moved
		console.log("cursor moved");
		let editor = vscode.window.activeTextEditor;
		if(editor){
			let lineNumber = editor.selection.active.line;
			markLine(lineNumber,"Pascal");	//marks line for myself atm
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

export function markLine(lineNumber: number, name: string): void {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
	  	let line = editor.document.lineAt(lineNumber);
	  	let decoration = {range: line.range,hoverMessage: name};
	  	editor.setDecorations(color,[decoration]);	// fragen ob hover oder label; farbe sollte ja eindeutig genug sein.
	}
  }

// This method is called when your extension is deactivated
export function deactivate() {}
