import * as vscode from 'vscode';
import {getProjectId, getUserName, getUsers} from '../extension';
import {ChatData} from '../interface/data';
import {sendChatMessage} from '../ws';

export class ChatViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'vscode-collab-chatView';

    private _view?: vscode.WebviewView;

    private chat: object[] = [];

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) {
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'sendMsg': {
                    sendChatMessage(data.content, getUserName(), getProjectId());
                    break;
                }
                case 'initChat': {
                    if (!this._view) {
                        return;
                    }
                    this._view.webview.postMessage({type: "chat", chat: this.chat});
                }
            }
        });
    }

    private addMsg(message: any) {
        let earlyMsg = false
        for (let i = 0; i < this.chat.length; i++) {
            const chatMsg: any = this.chat[i];
            if (chatMsg.time > message.time) {
                this.chat.splice(i, 0, message)
                earlyMsg = true;
                break;
            }
        }
        if (!earlyMsg) {
            this.chat.push(message);
        }
    }

    public receivedMsg(data: ChatData) {
        if (!getUsers().has(data.name)) {
            return;
        }
        const webViewChatMessage = {type: 'receivedMsg', name: data.name, time: data.time, msg: data.msg}
        this.addMsg(webViewChatMessage);

        if (this._view) {
            //this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
            this._view.webview.postMessage(webViewChatMessage);
        }
        if (!this._view?.visible) {
            vscode.window.setStatusBarMessage("User: " + data.name + " send a Message", 5000);
        }
    }


    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Chat</title>
			</head>
			<body>
				<ul class="chatBody">
				</ul>
				<hr>

				<textarea id="submitMsg" name="chatMessage" placeholder="send message"></textarea>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
