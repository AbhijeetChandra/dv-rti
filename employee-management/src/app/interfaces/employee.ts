export interface Employee {
    id : string, 
    name : string,
    role : string, 
    iana? : string,
    startDateUTC : string,
    endDateUTC : string,
    startDateTextLocal? : string
    endDateTextLocal? : string
}


export interface ResponseData {
    status : number,
    msg : string
}