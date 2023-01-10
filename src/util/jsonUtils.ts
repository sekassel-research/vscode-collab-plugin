export function buildUserMessage(operation: string, name: string, project: string) {
    return `{"operation":"${operation}","data":{"name":"${name}","project":"${project}"}}`
}

export function buildCursorMovedMessage(pathName: string, lineNumber: number, position: number, selectionLine: number, selectionPosition: number, name: string, project: string) {
    return `{"operation":"cursorMoved","data":{"pathName":"${pathName}","lineNumber":${lineNumber},
            "position":${position},"selectionLine":${selectionLine},"selectionPosition":${selectionPosition},"name":"${name}", "project":"${project}"}}`;
}

export function buildTextAddedMessage(pathName: string, lineNumber: number, position: number, content: string, name: string, project: string) {
    return `{"operation":"textAdded","data":{"pathName":"${pathName}","lineNumber":${lineNumber},"position":${position},
    "content":"${content}","name":"${name}", "project":"${project}"}}`;
}

export function buildTextReplacedMessage(pathName: string, fromLine: number, fromPosition: number, toLine: number, toPosition: number, content: string, name: string, project: string) {
    return `{"operation":"textReplaced","data":{"pathName":"${pathName}","fromLine":${fromLine},"fromPosition":${fromPosition},
    "toLine":${toLine},"toPosition":${toPosition},"content":"${content}","name":"${name}", "project":"${project}"}}`;
}
