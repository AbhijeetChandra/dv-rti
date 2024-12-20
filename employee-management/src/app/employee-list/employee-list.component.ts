import { Component, computed, OnInit, signal } from '@angular/core';
import { StorageAPIService } from '../services/storage-api.service';
import { Employee } from '../interfaces/employee';
import { NgClass, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [NgFor, RouterModule, NgClass, MatIconModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit{


  employeeList = signal<Employee[]>([]);

  currentEmployees = computed(() => {
    return this.employeeList()
          .filter(emp => !emp.endDateUTC)
          .map(item =>{
            item.startDateTextLocal = this.utilsService.getLocalDateText(item.startDateUTC);
            return  {...item , duration : `From ${item.startDateTextLocal}` }
          }) 
  });

  previousEmployees =  computed(() => {
    return this.employeeList()
          .filter(emp => emp.endDateUTC)
          .map(item =>{ 
            item.startDateTextLocal = this.utilsService.getLocalDateText(item.startDateUTC);
            return  {...item , duration : `${item.startDateTextLocal} - ${item.endDateTextLocal}` }
          }) 
  });

  constructor(private storageAPIService : StorageAPIService, private utilsService : UtilsService, private router : Router) {

  }
  ngOnInit() {
    let employees =  structuredClone(this.storageAPIService.getCachedEmployees());
    this.employeeList.update(list => employees);
    this.storageAPIService.getEmployees().subscribe( (res:any) => {
       let employees =  structuredClone(res['data']);
       this.employeeList.update(list => employees);
    });
  }

  deleteEmp(id : string) {
    this.storageAPIService.deleteEmployee(id).subscribe( res => {
      this.employeeList.update(list => {
        let index = list.findIndex(empl => empl.id === id);
        if(index !== -1) list.splice( index, 1);
        return [...list];
      });
    }); 
 
  }

  openForm(evt:any) {
    this.router.navigate(['form', evt.action], {
      queryParams : { id : evt.id }
    });
  }
    

    
}
