import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class StorageAPIService {

  constructor(private storeService : StoreService) { }

  getEmployees() : Employee[] {
    return this.storeService.getAllEmployees();
  }

  getEmployeeById(id:string):Employee {
    return this.storeService.getEmployeeById(id);
  }

  addOrUpdateEmployee(emp : Employee, type : string) {
    return type === 'add' ?  this.storeService.addEmployee(emp) : this.storeService.updateEmployee(emp);
  }

  deleteEmployee(id: string) {
    this.storeService.deleteEmployee(id);
  }

  getRoles() {
    return this.storeService.getAllRoles();
  }

}
