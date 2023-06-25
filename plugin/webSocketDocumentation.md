# Websocket documentation

This is the documentation of the websocket communication. Each msg has a brief description when the operation will be
sent by a user and an example msg. All websocket-messages are in json-format. The example wss also adds an time field,
but it is not used currently in the extension.

### userJoined

This operation is sent by a user who connects to the ws.

Example:

```json
{
  "operation": "userJoined",
  "data": {
    "name": "John Doe",
    "project": "Default Project"
  }
}
```

### userLeft

This operation is sent by a user who disconnects to the ws.

Example:

```json
{
  "operation": "userLeft",
  "data": {
    "name": "John Doe",
    "project": "Default Project"
  }
}
```

### activeUsers

This msg gets send to the just joined user.

Example:

```json
{
  "operation": "activeUsers",
  "data": [
    "John Doe",
    "Alice",
    "Bob"
  ]
}
```

### cursorMoved

This operation is sent by a user who moved his cursor. If the cursor position is not equal to the selectionEnd position,
the user's selection is also displayed for the other users.

Example:

```json
{
  "operation": "cursorMoved",
  "data": {
    "pathName": "example/file.txt",
    "cursor": {
      "line": 3,
      "character": 10
    },
    "selectionEnd": {
      "line": 3,
      "character": 20
    },
    "name": "John Doe",
    "project": "Default Project"
  }
}
```

### textReplaced

This operation is sent by a user who makes changes in their texteditor. If the content is empty, the user deleted the
content between the positions.

Example:

```json
{
  "operation": "textReplaced",
  "data": {
    "pathName": "file.txt",
    "from": {
      "line": 3,
      "character": 10
    },
    "to": {
      "line": 3,
      "character": 15
    },
    "content": "Example Text",
    "name": "John Doe",
    "project": "Default Project"
  }
}
```

### getCursors

This msg is sent from the just joined user after connecting to the ws or if the user is changing the file. This msg will
trigger all other users to send their current cursor position.

Example:

```json
{
  "operation": "getCursors",
  "data": {
    "name": "John Doe",
    "project": "Default Project"
  }
}
```

### chatMsg

This operation is sent by a user who wrote a chat message.

Example:

```json
{
  "operation": "chatMsg",
  "data": {
    "msg": "Hello, World!",
    "name": "John Doe",
    "time": "2023-05-11T12:00:00Z"
  }
}
```
