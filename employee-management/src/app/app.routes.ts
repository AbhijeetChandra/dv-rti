import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

export const routes: Routes = [
    { path : "", redirectTo : "list" , pathMatch : "full"},
    { path : "list", component : EmployeeListComponent },
    { path : "form/:action", component : EmployeeFormComponent},
    { path : "**", redirectTo : "list" }
];
