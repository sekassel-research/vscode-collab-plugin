import * as vscode from 'vscode';
import {stringToColor} from '../util/colourGen';

export class user {
    nameTag: vscode.TextEditorDecorationType;
    selection: vscode.TextEditorDecorationType;
    cursor: vscode.TextEditorDecorationType;


    constructor(name: string) {
        let color = stringToColor(name);

        this.nameTag = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 3em",
                contentText: name,
                border: '1px dotted ' + color,
            }
        });

        this.selection = vscode.window.createTextEditorDecorationType({
            backgroundColor: color + '66',
        });


        this.cursor = vscode.window.createTextEditorDecorationType({
            border: '1px solid ' + color,
        });
    }

    public getNameTag() {
        return this.nameTag;
    }

    public getSelection() {
        return this.selection;
    }

    public getCursor() {
        return this.cursor;
    }
}

