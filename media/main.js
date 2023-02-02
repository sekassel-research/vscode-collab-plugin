// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    let chat = [];

    const msgInput = document.getElementById('submitMsg');

    msgInput.style.height = 'auto';
    msgInput.style.height = msgInput.scrollHeight+5 + 'px';

    console.log(getComputedStyle(msgInput));

    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            vscode.postMessage({type: 'sendMsg', content: msgInput.value});
            msgInput.value = '';
            e.preventDefault();
            msgInput.style.height = 'auto';
            msgInput.style.height = msgInput.scrollHeight+5 + 'px';
        }
        if (getComputedStyle(msgInput).height.split("px")[0] < 270) {
            console.log(getComputedStyle(msgInput).height,getComputedStyle(msgInput).maxHeight)
            msgInput.style.height = 'auto';
            msgInput.style.height = msgInput.scrollHeight+5 + 'px';
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
                chat = message.chat;
                updateChat();
            }
        }
    });

    console.log("init chatView scripts");
    vscode.postMessage({type: 'initChat'});

    function addMsg(message) {
        let earlyMsg = false
        for (let i = 0; i < chat.length; i++) {
            const chatMsg = chat[i];
            if (chatMsg.time > message.time) {
                chat.splice(i, 0, message)
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


