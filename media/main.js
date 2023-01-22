// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const chat = [];

    const msgInput = document.querySelector('#submitMsg');

    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            vscode.postMessage({ type: 'sendMsg', content: msgInput.value});
            addMsg(msgInput);
            msgInput.value = '';
        }
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'receivedMsg':
                {
                    //addMsg(msgInput);
                    break;
                }
        }
    });

    console.log("init scripts");

    function addMsg(msgInput){
        chat.push(msgInput.value);
        updateChat(chat);
    }

    function updateChat(chat){
        const ul = document.querySelector('.chatBody');
        ul.textContent = '';
        for (const msg of chat) {

            const chatMsg = document.createElement('div');
            chatMsg.className = 'chatMsg';
            const user = document.createElement('user');
            user.className = 'userName';
            user.appendChild(document.createTextNode('Pascal:'));
            console.log(user);

            const content = document.createElement('content');
            content.className = 'content';
            content.appendChild(document.createTextNode(msg));
            
            chatMsg.appendChild(user);
            chatMsg.appendChild(content);

            ul.appendChild(chatMsg);
        }
    }

    /**
     * @param {Array<{ value: string }>} colors
     */
    function updateColorList(colors) {
        const ul = document.querySelector('.chatBody');
        ul.textContent = '';
        for (const color of colors) {
            const li = document.createElement('li');
            li.className = 'color-entry';

            const colorPreview = document.createElement('div');
            colorPreview.className = 'color-preview';
            colorPreview.style.backgroundColor = `#${color.value}`;
            colorPreview.addEventListener('click', () => {
                onColorClicked(color.value);
            });
            li.appendChild(colorPreview);

            const input = document.createElement('input');
            input.className = 'color-input';
            input.type = 'text';
            input.value = color.value;
            input.addEventListener('change', (e) => {
                const value = e.target.value;
                if (!value) {
                    // Treat empty value as delete
                    colors.splice(colors.indexOf(color), 1);
                } else {
                    color.value = value;
                }
                updateColorList(colors);
            });
            li.appendChild(input);

            ul.appendChild(li);
        }

        // Update the saved state
        vscode.setState({ colors: colors });
    }

    /** 
     * @param {string} color 
     */
    function onColorClicked(color) {
        vscode.postMessage({ type: 'colorSelected', value: color });
    }

    /**
     * @returns string
     */
    function getNewCalicoColor() {
        const colors = ['020202', 'f1eeee', 'a85b20', 'daab70', 'efcb99'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function addColor() {
        colors.push({ value: getNewCalicoColor() });
        updateColorList(colors);
    }
}());


