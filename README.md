# Vscode-collab-plugin

This extention is designed for code servers to synchronize work on projects in real time. This synchronization does not work with this extension on different directories.

## Features

 The cursors, their movement and the selection of all active users are displayed in real time. In the line where a user's cursor is located, a name tag and its cursor color are displayed behind the code for all other users. Supports writing, deleting, cutting, copying, pasting and replacing text. Attention is paid to the file in which the changes are located, so that the changes are only applied to the correct file.
 
  ![](https://github.com/sekassel-research/vscode-collab-plugin/blob/ReadMe/media/ReadMe/Hello%20World.gif)
  
  ![](https://github.com/sekassel-research/vscode-collab-plugin/blob/ReadMe/media/ReadMe/Mark.gif)
  
 In addition, all active users are displayed. When a user joins the project, a small notification is displayed at the bottom and the user is shown in the list of all active users. The users can communicate via a chat in the IDEA, so that they do not have to change the window if necessary. If a user hovers with the mouse over a chat message, he can see when it was sent. Finally, the chat has been extended by the ability to jump to a specific line. To do this, a user only has to write "line X" in his chat message. If a user now clicks on "line X", the active window will jump to line x.
 
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
