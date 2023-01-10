export interface data {
    name: string
    project: string
}

export interface cursorMovedData extends data {
    pathName: string,
    lineNumber: number,
    position: number,
    selectionStart: number,
    selectionEnd: number,
}

export interface textAddedData extends data {
    pathName: string,
    lineNumber: number,
    position: number,
    content: string
}

export interface textReplacedData extends data {
    pathName: string,
    fromLine: number,
    fromPosition: number,
    toLine: number,
    toPosition: number,
    content: string
}
