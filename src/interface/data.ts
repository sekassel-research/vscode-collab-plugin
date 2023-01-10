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
