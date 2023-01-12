export interface Data {
    name: string
    project: string
}

export interface CursorMovedData extends Data {
    pathName: string,
    lineNumber: number,
    position: number,
    selectionLine: number,
    selectionPosition: number,
}

export interface TextReplacedData extends Data {
    pathName: string,
    fromLine: number,
    fromPosition: number,
    toLine: number,
    toPosition: number,
    content: string
}
