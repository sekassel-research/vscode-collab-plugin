# Vscode-collab-plugin

This extention is designed for code servers to synchronize work on projects in real time. This synchronization does not work with this extension on different directories.

## Features

 With the extension installed, users can enjoy real-time display of cursors and user selection, making it effortless to collaborate on shared files. A name tag and color are displayed behind the code for each user's cursor, allowing for easy identification. The extension supports a range of functions, including writing, deleting, cutting, copying, pasting, and replacing text. To ensure data accuracy, changes are only applied to the correct file, preventing any unintended modifications.
 
  ![](https://github.com/sekassel-research/vscode-collab-plugin/blob/ReadMe/media/ReadMe/Hello%20World.gif)
  
  ![](https://github.com/sekassel-research/vscode-collab-plugin/blob/ReadMe/media/ReadMe/Mark.gif)

 In addition to real-time cursor display and user selection, the tool also provides an overview of all active users in the project. When a new user joins, a small notification is displayed at the bottom, and their name is added to the list of active users. With the integrated chat feature, users can communicate with each other without having to switch to a separate window. When hovering over a chat message, users can easily see when it was sent. We've also added a new feature that allows users to jump to a specific line in the shared file by typing "line X" in their chat message. Clicking on the "line X" hyperlink will automatically take the user to that line in the active window.
 
  ![](https://github.com/sekassel-research/vscode-collab-plugin/blob/ReadMe/media/ReadMe/Chat.gif)

## Development

  to work with the avaliable code:

### Set up vscode-collab-plugin

  To get a local copy of the current code, clone it using git:

    $ git clone https://github.com/sekassel-research/vscode-collab-plugin.git
    $ cd vscode-collab-plugin

  To work on this extension you need to run the following comands:

    $ npm install 
  
   After that you can work on the extension.

### Build .vsix file

  To install the extension you can generate a .vsix file. To do this, first clone this repository, then run 
    
    $ npm install vsce
    $ vsce package
  
  Once this is done you can install the extension.
 
## Assets

 Handshake Icon licend under https://creativecommons.org/licenses/by/3.0/deed.en

 shoutout to the creator David and his website https://thenounproject.com/kaxgyatso/
