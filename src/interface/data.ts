export interface data{
    name:string
    project:string
}

export interface cursorMovedData extends data {
    pathName:string,
    lineNumber:number,
    position:number
}

export interface textChangedData extends data {
    pathName:string,
    lineNumber:number,
    content:string
}