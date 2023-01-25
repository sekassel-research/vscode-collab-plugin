// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const chat = [];

    const msgInput = document.querySelector('#submitMsg');

    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            vscode.postMessage({type: 'sendMsg', content: msgInput.value});
            msgInput.value = '';
        }
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'receivedMsg': {
                addMsg(message);
                break;
            }
        }
    });

    console.log("init chatView scripts");

    function addMsg(message) {
        let earlyMsg = false
        for (let i = 0; i < chat.length; i++) {
            const chatMsg = chat[i];
            if (chatMsg.time > message.time) {
                chat.splice(i, 0, message)
                break;
            }
        }
        if (!earlyMsg) {
            chat.push(message);
        }
        updateChat(chat);
    }

    function updateChat(chat) {
        console.log("updateChat called")
        const ul = document.querySelector('.chatBody');
        ul.textContent = '';
        for (const message of chat) {
            const chatMsg = document.createElement('div');
            chatMsg.className = 'chatMsg';
            chatMsg.title = new Date(message.time).toLocaleString('de-DE');
            const user = document.createElement('user');
            user.className = 'userName';
            user.appendChild(document.createTextNode(message.name));
            console.log(user);

            const content = document.createElement('content');
            content.className = 'content';
            content.appendChild(document.createTextNode(message.msg));

            chatMsg.appendChild(user);
            chatMsg.appendChild(content);

            ul.appendChild(chatMsg);
        }
    }
}());


