import * as vscode from 'vscode';
import {User} from './user';

export class ActiveUsersProvider implements vscode.TreeDataProvider<UserMapItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<UserMapItem | undefined> = new vscode.EventEmitter<UserMapItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<UserMapItem | undefined> = this._onDidChangeTreeData.event;
    private displayMode: string;

    constructor(private map: Map<string, User>, displayMode: string = 'name') {
        this.displayMode = displayMode;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    setDisplayMode(mode: string): void {
        this.displayMode = mode;
    }

    getTreeItem(element: UserMapItem): vscode.TreeItem {
        element.command = {
            command: 'vscode-collab-plugin.userMapItemClick',
            title: 'click entry',
            arguments: [element],
        };
        return element;
    }

    getChildren(element?: UserMapItem): UserMapItem[] {
        return Array.from(this.map.entries()).map(([userId, value]) => {
            let label: string;
            switch (this.displayMode) {
                case 'name':
                    label = value.name;
                    break;
                case 'displayName':
                    label = value.displayName;
                    break;
                case 'id':
                default:
                    label = value.id;
                    break;
            }
            return new UserMapItem(label, value);
        });
    }
}

export class UserMapItem extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly value: User) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }

    handleClick(): string {
        return this.value.id;
    }
}
