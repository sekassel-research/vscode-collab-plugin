// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    let chat = [];
    let user;

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
                user = message.user;
                displayMode = message.displayMode;
                chat = message.chat;
                updateChat();
            }
            case "displayMode": {
                displayMode = message.displayMode;
                updateChat();
            }
        }
    });

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

            // RegEx-Ausdruck zur Extraktion der Zeilennummer und des "Line"/"Zeile"-Präfixes
            const regex = /(Line|Zeile)\s*(\d+)/gi;

            chatMsg.title = new Date(message.time).toLocaleString('de-DE');

            const user = document.createElement('user');
            user.className = 'userName';
            if (displayMode === "id") {
                user.appendChild(document.createTextNode(message.userId));
            }
            if (displayMode === "name") {
                user.appendChild(document.createTextNode(message.userName));
            } 
            if (displayMode === "displayName")  {
                user.appendChild(document.createTextNode(message.userDisplayName));
            }
            if (message.userId === user.id) {
                chatMsg.style.border = "1px solid #1139EE";
                chatMsg.style.backgroundColor = "#4169E1";
            } else {
                chatMsg.style.border = "1px solid lightblue";
                chatMsg.style.backgroundColor = "#3B494F";
            }

            const content = document.createElement('content');
            content.className = 'content';

            // Ersetzen von "Line" oder "Zeile" gefolgt von Leerzeichen und Ziffern durch Links
            content.innerHTML = message.msg.replace(regex, '<a href="#" class="lineLink">$&</a>');

            chatMsg.appendChild(user);
            chatMsg.appendChild(content);

            ul.appendChild(chatMsg);
        }

        // Hinzufügen eines Event-Listeners für alle Links mit der Klasse "lineLink"
        const lineLinks = document.querySelectorAll('.lineLink');
        lineLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const lineNumber = e.target.textContent.match(/\d+/)[0];
                vscode.postMessage({type: 'jumpToLine', content: lineNumber});
            });
        });
        ul.scrollTop = ul.scrollHeight;
    }

    function updateStyle() {
        msgInput.style.height = 'auto';
        msgInput.style.height = msgInput.scrollHeight + 5 + 'px';
        chatBody.style.height = (body.offsetHeight - msgInput.offsetHeight) - 5 + 'px';
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}());


