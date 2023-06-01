import * as vscode from 'vscode';
import {stringToColor} from '../util/colourGen';

export class User {
    id: string;
    name: string;
    displayName: string;
    colorIndicator: vscode.TextEditorDecorationType;
    idTag: vscode.TextEditorDecorationType;
    nameTag: vscode.TextEditorDecorationType;
    displayNameTag: vscode.TextEditorDecorationType;
    selection: vscode.TextEditorDecorationType;
    cursor: vscode.TextEditorDecorationType;
    position!: {
        path: string,
        cursor: vscode.Position,
        selectionEnd: vscode.Position
    };

    constructor(userId: string, userName: string, userDisplayName: string) {
        this.id = userId;
        this.name = userName;
        this.displayName = userDisplayName;
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
        this.idTag = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 0.25em",
                contentText: userId,
            }
        });

        this.nameTag = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 0.25em",
                contentText: userName,
            }
        });

        this.displayNameTag = vscode.window.createTextEditorDecorationType({
            after: {
                margin: "0 0 0 0.25em",
                contentText: userDisplayName,
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

    public getNameTag(displayMode: string) {
        if (displayMode === "id") {
            return this.idTag;
        }
        if (displayMode === "name") {
            return this.nameTag;
        }
        return this.displayNameTag;
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

    public setPosition(path: string, cursor: vscode.Position, selectionEnd: vscode.Position) {
        this.position = {path, cursor, selectionEnd};
    }
}

