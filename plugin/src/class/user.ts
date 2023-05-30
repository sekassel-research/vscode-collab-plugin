import * as vscode from 'vscode';
import {stringToColor} from '../util/colourGen';

export class User {
    colorIndicator: vscode.TextEditorDecorationType;
    nameTag: vscode.TextEditorDecorationType;
    selection: vscode.TextEditorDecorationType;
    cursor: vscode.TextEditorDecorationType;
    position!: {
        path: string,
        cursor: vscode.Position,
        selectionEnd: vscode.Position
    };

    constructor(userId: string) {
        let color = stringToColor(userId);

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
        // nameTag depends on settings so this need an switch case /if clause...
        this.nameTag = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 0.25em",
                contentText: userId,
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

    public getPosition() {
        return this.position;
    }

    public setPosition(path:string,cursor:vscode.Position,selectionEnd:vscode.Position) {
        this.position = {path, cursor, selectionEnd};
    }
}

