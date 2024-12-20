import { Component, OnInit, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { StorageAPIService } from '../services/storage-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe, NgClass, TitleCasePipe } from '@angular/common';
import { Employee } from '../interfaces/employee';
import { FormsModule } from '@angular/forms';
import { DateWrapperComponent } from '../date-wrapper/date-wrapper.component';
import { UtilsService } from '../services/utils.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule, 
    MatDatepickerModule,
    MatInputModule, 
    MatIconModule,
    NgClass,
    TitleCasePipe,
    JsonPipe
  ], 
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit{

  
  mode = signal('add');
  // empData = signal({
  //    id : "", name : "Stryker Williams", role : "Flutter Developer", startDateUTC : "", endDateUTC : ""
  // }); 
  empData = signal<Employee>({id : "", name : "", role : "", startDateUTC :"", endDateUTC : "", startDateTextLocal :"", endDateTextLocal : ""});
  roles = signal<any>([]);
  validators = signal({
    isInputValid : true,
    isDropdownValid : true,
    isStartDateValid : true,
    isDateRangeValid : true
  });
  dialogRef:any;
  formMode: string = 'add';
 
  constructor(
    private storageAPIService : StorageAPIService, 
    private utilsService : UtilsService, 
    private router : Router, private route : ActivatedRoute,
    private dialog : MatDialog
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mode.set(params['action']);
      if(params['action'] === 'add') {
        this.formMode = 'add';
        this.empData.set({
          id : "",
          name : "",
          role : "",
          startDateUTC : "",
          endDateUTC : "",
          startDateTextLocal :"",
          endDateTextLocal : ""
        });
      }
      else {
        this.formMode = 'edit'
        this.route.queryParams.subscribe(qParams => {
          this.storageAPIService.getEmployeeById(qParams['id']).subscribe((res:any) => {
            if(res.data) {
              this.empData.set(res.data);
            }
          });
        })
      }
    });
   
    let roles = this.storageAPIService.getRoles();
    this.roles.update((list) => roles);
  }

  openDialog(type:string) {
    let { height, width } = this.getPopupDimensions();
    let dateUTC = this.formMode === 'add' ? null : type === 'startDate' ?  this.empData().startDateUTC : this.empData().endDateUTC;

    this.dialogRef =  this.dialog.open(DateWrapperComponent, {
      height,
      width,
      data : { //Current Month : "Tue Dec 17 2024 05:30:00 GMT+0530 (India Standard Time)",
        dateUTC , // : "Mon Feb 17 2025 05:30:00 GMT+0530 (India Standard Time)",//"Mon, 15 Oct 2029 18:30:00 GMT" ,
        type 
      },
      disableClose : true
    })

    this.dialogRef.afterClosed().subscribe((result: any) => {
      result = JSON.parse(result);
      if(result.action === 'cancel') return;
      this.empData.update(obj => {
        if( result['type'] === 'startDate' ) {
          obj.startDateTextLocal = result.dateTextLocal;
          obj.startDateUTC = result.dateUTC;
        }
        else if( result['type'] === 'endDate' ) {
          obj.endDateTextLocal = result.dateTextLocal;
          obj.endDateUTC = result.dateUTC;
        }
        return obj;
      })
    });
  }

  getPopupDimensions()  { //Vary, dimensions if needed
    // let range = this.utilsService.getScreenRange();
    // switch(range) {
    //   case 'small' :
    //   return { height : '80%', width : '80%' } 
    //   case 'mid' :
    //   return { height : '80%', width : '80%' }
    //   case 'large' :
    //   return { height : '80%', width : '80%' }
    //  }
    return { height : '80%', width : '80%'}
  }
 
  onAction(action:string) {
   
    if(action === 'cancel') {
      this.router.navigate(['list']);
      return;
    }

    let payload = this.empData();
    if(!this.validate(payload)) return;

    payload.iana =Intl.DateTimeFormat().resolvedOptions().timeZone;  
    payload.id = payload.id || this.utilsService.getUUID();

    this.storageAPIService.addOrUpdateEmployee(payload, this.formMode).subscribe(
      res => {
        //Add alert then navigate away after some delay
        this.router.navigate(['list']);

      }
    )
 
  }

  validate(payload : any) : boolean {
    let isInputValid = payload.name;
    let isDropdownValid = payload.role;
    let isStartDateValid = payload.startDateUTC;
    let isDateRangeValid = !payload.endDateUTC ? true : (new Date(payload.startDateUTC) <= new Date(payload.endDateUTC)) ;
    this.validators.update(obj => {
      obj.isInputValid = isInputValid ;
      obj.isDropdownValid = isDropdownValid;
      obj.isStartDateValid = isStartDateValid;
      obj.isDateRangeValid = isDateRangeValid
      return obj
    })
   
    return isInputValid && isDropdownValid && isStartDateValid && isDateRangeValid;
  }
  
}


