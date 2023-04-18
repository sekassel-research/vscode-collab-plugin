import * as vscode from 'vscode';
import {stringToColor} from '../util/colourGen';

export class User {
    colorIndicator: vscode.TextEditorDecorationType;
    nameTag: vscode.TextEditorDecorationType;
    selection: vscode.TextEditorDecorationType;
    cursor: vscode.TextEditorDecorationType;


    constructor(name: string) {
        let color = stringToColor(name);

        this.colorIndicator = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 3em",
                contentText: "",
                backgroundColor: color,
                border: "solid 1px " + color,
                width: "10px",
                height: "10px"
            }
        });

        this.nameTag = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 0.25em",
                contentText: name,
            }
        });

        this.selection = vscode.window.createTextEditorDecorationType({
            border: '1px dashed ' + color + '66',
        });


        this.cursor = vscode.window.createTextEditorDecorationType({
            border: '1px solid ' + color,
        });
    }

    public getColorIndicator() {
        return this.colorIndicator;
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

