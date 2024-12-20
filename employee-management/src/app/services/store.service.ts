import { Injectable } from '@angular/core';
import { Employee, ResponseData } from '../interfaces/employee';
import { Observable } from 'rxjs';
import { employeeRoles } from '../constants/utilConstants';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
 
  allEmployees : Employee[] = [
    {
      "id": "e02dc2af-6129-4561-95a0-13fb62e509d0",
      "name": "LOGAN 1",
      "role": "QA Tester",
      "startDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "endDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "startDateTextLocal": "9 Dec 2024",
      "endDateTextLocal": "9 Dec 2024",
      "iana": "Asia/Calcutta"
    },
    {
      "id": "e02dc2af-6129-4561-95a0-13fb62e509d1",
      "name": "LOGAN 2",
      "role": "QA Tester",
      "startDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "endDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "startDateTextLocal": "9 Dec 2024",
      "endDateTextLocal": "9 Dec 2024",
      "iana": "Asia/Calcutta"
    },
    {
      "id": "e02dc2af-6129-4561-95a0-13fb62e509d1",
      "name": "LOGAN 2",
      "role": "QA Tester",
      "startDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "endDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "startDateTextLocal": "9 Dec 2024",
      "endDateTextLocal": "9 Dec 2024",
      "iana": "Asia/Calcutta"
    },
    {
      "id": "e02dc2af-6129-4561-95a0-13fb62e509d1",
      "name": "LOGAN 2",
      "role": "QA Tester",
      "startDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "endDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "startDateTextLocal": "9 Dec 2024",
      "endDateTextLocal": "9 Dec 2024",
      "iana": "Asia/Calcutta"
    },
    {
      "id": "e02dc2af-6129-4561-95a0-13fb62e509d1",
      "name": "LOGAN 2",
      "role": "QA Tester",
      "startDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "endDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "startDateTextLocal": "9 Dec 2024",
      "endDateTextLocal": "9 Dec 2024",
      "iana": "Asia/Calcutta"
    },
    {
      "id": "e02dc2af-6129-4561-95a0-13fb62e509d2",
      "name": "LOGAN 3",
      "role": "QA Tester",
      "startDateUTC": "Sun, 08 Dec 2024 18:30:00 GMT",
      "endDateUTC": "",
      "startDateTextLocal": "9 Dec 2024",
      "endDateTextLocal": "",
      "iana": "Asia/Calcutta"
    }
  ];
  
  constructor() {

   }



  getAllEmployees() : Employee[] {
    return this.allEmployees;
  }
  
  getEmployeeById(id : string) : Employee {
    let emp = this.allEmployees.find(emp  => emp.id === id) as Employee;
    return emp;
  }

  addEmployee(emp : Employee) : Observable<ResponseData> {
    return new Observable( (obs) => {
      this.allEmployees.push(emp);
      obs.next({status : 200, msg : 'saved'});
    } );
  }

  updateEmployee(emp : Employee) : Observable<ResponseData> {
    return new Observable( (obs) => {
      let index = this.allEmployees.findIndex(empl => empl.id === emp.id);
      this.allEmployees.splice(index, 1, emp)
      obs.next({status : 200, msg : 'updated'});
    } );
  }

  deleteEmployee(id: string) {
    let index = this.allEmployees.findIndex(empl => empl.id === id);
    if(index !== -1) this.allEmployees.splice(index,1);
  }
 

  getAllRoles()  {
    return employeeRoles;
  }


}
