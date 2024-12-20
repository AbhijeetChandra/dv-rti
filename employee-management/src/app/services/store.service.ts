import { Injectable } from '@angular/core';
import { Employee, ResponseData } from '../interfaces/employee';
import { Observable } from 'rxjs';
import { employeeRoles } from '../constants/utilConstants';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
 
  allEmployees : Employee[] = [
  ];

 
  rtiDB!: IDBDatabase;
  
  constructor() {
    this.openIDBnCreateStore();
  }

  openIDBnCreateStore() {
      let openRequest = indexedDB.open('rtiDB', 1); 
      openRequest.onupgradeneeded = function(event: any) {
        let db = openRequest.result;
        switch(event.oldVersion) { 
          case 0:
            // version 0 means that the client had no database
            // perform initialization
            if (!db.objectStoreNames.contains('employees')) {
              db.createObjectStore('employees', {keyPath: 'id'}); // //Stores can only be created/updated/deleted on DB upgate
            }
            break;
          case 1:
            // client had version 1
            // update
            // Not needed right now ; for later use (when a DB needs to be updated with version 2)
        }
      };
      
      openRequest.onerror = function() {
        console.error("Error", openRequest.error);
      };
      
      openRequest.onsuccess = () => {
        console.log("DB is ready...");
        this.rtiDB = openRequest.result; //Set DB on Store Service level
      };
  }

  getEmpStorePromise() {
    return new Promise((res, rej) => {
      let sI = setInterval(()=> {
        if(this.rtiDB) {
          clearInterval(sI)
          res(this.rtiDB.transaction("employees", "readwrite").objectStore("employees"));
        }
      }, 50);
    });
 
  }

  getEmpStore() {
    return this.rtiDB.transaction("employees", "readwrite").objectStore("employees")
  }

  
  getAllEmployees() {
    return new Observable( obs => {
      setTimeout(( )=> {
        let req = this.getEmpStore().getAll();
        req.onsuccess = () => {
          obs.next({status : 200, msg : 'Success', data : req.result});
        };
        req.onerror = () => {
          obs.next({status : 500, msg : 'Error occured'});
        };   
      }, 500);
 
    });
  }
  
  getEmployeeById(id : string)  {
    return new Observable( (obs) => {
      let req = this.getEmpStore().get(id);
      req.onsuccess = () => {
        obs.next({status : 200, msg : 'employee added', data : req.result});
      };
      req.onerror = () => {
        obs.next({status : 500, msg : 'Error occured'});
      };   
    }); 
  }

  addEmployee(emp : Employee) : Observable<ResponseData> {
    return new Observable( (obs) => {
      let req = this.getEmpStore().add(emp);
      req.onsuccess = () => {
        this.allEmployees.push(emp);
        obs.next({status : 200, msg : 'employee added'});
      };
      req.onerror = () => {
        obs.next({status : 500, msg : 'Error occured'});
      };   
    }); 
  }

  updateEmployee(emp : Employee) : Observable<ResponseData> {
    return new Observable( (obs) => {
      let req = this.getEmpStore().put(emp);
      req.onsuccess = () => {
        let idx = this.allEmployees.findIndex( empl => empl.id === emp.id);
        this.allEmployees.splice(idx,1,emp);
        obs.next({status : 200, msg : 'employee updated'});
      };
      req.onerror = () => {
        obs.next({status : 500, msg : 'Error occured'});
      };   
    } );
  }

  deleteEmployee(id: string) {
    return new Observable( (obs) => {
      let req = this.getEmpStore().delete(id);
      req.onsuccess = () => {
        let idx = this.allEmployees.findIndex( empl => empl.id === id);
        this.allEmployees.splice(idx,1);
        obs.next({status : 200, msg : 'employee updated'});
      };
      req.onerror = () => {
        obs.next({status : 500, msg : 'Error occured'});
      };   
    } );
  }
 

  getAllRoles()  {
    return employeeRoles;
  }


}
