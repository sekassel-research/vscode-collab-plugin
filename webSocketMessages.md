# Websocket documentation

The examples for asynchronous communication only consist of example JSON messages. The various operations are listed below:


### userJoined

This operation is send by a user who connects to the ws.

Example:

```json
{
    "operation": "userJoined",
    "data": {
        "name": "John Doe",
        "project" : "Default Project"
    }
}
```

### userLeft

This operation is send by a user who disconnects to the ws.

Example:

```json
{
    "operation": "userLeft",
    "data": {
        "name": "John Doe",
        "project" : "Default Project"
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

This operation is send by a user who moved his cursor. If the cursor position is not equal to the selectionEnd position, the user's selection is also displayed for the other users.

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
        "project" : "Default Project"
    }
}
```

### textReplaced

This operation is send by a user who makes changes in the texteditor.

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
        "project" : "Default Project"
    }
}
```

### getCursors

This msg is send from the just joined user after conntecting to the ws or if the user is changing the file.

Example:

```json
{
    "operation": "getCursors",
    "data": {
        "name": "John Doe",
        "project" : "Default Project"
    }
}
```

### chatMsg

This operation is send by a user who wrote a chat message.

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

### delKey

This operation is send by a user who makes changes with the delete key in the texteditor.

Example:

```json
{
    "operation": "delKey",
    "data": {
        "pathName": "file.txt",
        "from": {
            "line": 3,
            "character": 10
        },
        "delLinesCounter": 1,
        "delCharCounter": 5,
        "name": "John Doe"
    }
}
```