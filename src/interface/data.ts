interface data{
    name:string
    project:string
}

interface cursorMovedData extends data {
    pathName:string,
    lineNumber:number,
    position:number
}

interface textChangedData extends data {
    pathName:string,
    lineNumber:number,
    content:string
}