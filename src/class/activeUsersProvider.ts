import * as vscode from 'vscode';
import {User} from './user';

export class ActiveUsersProvider implements vscode.TreeDataProvider<UserMapItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<UserMapItem | undefined> = new vscode.EventEmitter<UserMapItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<UserMapItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private map: Map<string, User>) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: UserMapItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: UserMapItem): UserMapItem[] {
        return Array.from(this.map.entries()).map(([key, value]) => new UserMapItem(key, value));
    }
}


class UserMapItem extends vscode.TreeItem {
    constructor(public readonly key: string, public readonly value: User) {
        super(key, vscode.TreeItemCollapsibleState.None);
    }
}
