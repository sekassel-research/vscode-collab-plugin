// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    let chat = [];
    let userName = "";

    const body = document.getElementById('body');
    const msgInput = document.getElementById('submitMsg');
    const chatBody = document.getElementById('chatBody');

    updateStyle();

    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            vscode.postMessage({type: 'sendMsg', content: msgInput.value});
            msgInput.value = '';
            e.preventDefault();
            updateStyle();
        }
        if (getComputedStyle(msgInput).height.split("px")[0] < 200) {
            updateStyle();
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
            case 'chat': {
                userName = message.userName;
                chat = message.chat;
                updateChat();
            }
        }
    });

    console.log("init chatView scripts");
    vscode.postMessage({type: 'initChat'});

    function addMsg(message) {
        let earlyMsg = false;
        for (let i = 0; i < chat.length; i++) {
            const chatMsg = chat[i];
            if (chatMsg.time > message.time) {
                chat.splice(i, 0, message);
                earlyMsg = true;
                break;
            }
        }
        if (!earlyMsg) {
            chat.push(message);
        }
        updateChat();
    }

    function updateChat() {
        const ul = document.querySelector('.chatBody');
        ul.textContent = '';
        for (const message of chat) {
            const chatMsg = document.createElement('div');
            chatMsg.className = 'chatMsg';
            chatMsg.title = new Date(message.time).toLocaleString('de-DE');
            const user = document.createElement('user');
            user.className = 'userName';
            user.appendChild(document.createTextNode(message.name));
            if (message.name === userName) {
                chatMsg.style.border = "1px solid #1139EE";
                chatMsg.style.backgroundColor = "#4169E1";
            } else {
                chatMsg.style.border = "1px solid lightblue";
                chatMsg.style.backgroundColor = "#3B494F";
            }

            const content = document.createElement('content');
            content.className = 'content';
            content.appendChild(document.createTextNode(message.msg));

            chatMsg.appendChild(user);
            chatMsg.appendChild(content);

            ul.appendChild(chatMsg);
        }
    }

    function updateStyle() {
        msgInput.style.height = 'auto';
        msgInput.style.height = msgInput.scrollHeight + 5 + 'px';
        chatBody.style.height = (body.offsetHeight - msgInput.offsetHeight) - 5 + 'px';
    }
}());


