import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { Component, computed, Inject, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-date-wrapper',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf,NgClass, MatCalendar,  MatIconModule, JsonPipe],
  templateUrl: './date-wrapper.component.html',
  styleUrl: './date-wrapper.component.scss'
})
export class DateWrapperComponent {

  selectedDate: any = signal(null);

  dateBtnsViews = signal( {
    view1 : [{name : "Today",selected : false},{name : "Next Monday",selected : false}, {name : "Next Tuesday",selected : false},{name : "After 1 week", selected : false}],
    view2 : [{name : "No Date",selected : false},{name : "Today",selected : false}]
  })

  dateBtnsViewsComputed = computed(() => {
    let views = this.dateBtnsViews();
    return this.data.type === 'startDate'? views.view1 : views.view2;
  });

  dateTextLocal = computed(()=>{
    const dateObj = this.selectedDate();
    if(!dateObj) return "No Date";
    return this.utilsService.getLocalDateText(dateObj.toUTCString())
  });
 
  @ViewChild(MatCalendar)
  calendar!: MatCalendar<Date>;





  constructor (
    @Inject(MAT_DIALOG_DATA) public data: {dateUTC: string, type : string},
    public dialogRef: MatDialogRef<any>,
    private utilsService : UtilsService
  ) {

  }

  ngOnInit() {
    let data  = this.data; 
    if(data.dateUTC) {
      this.selectedDate.set(new Date(data.dateUTC));
    }
  }

  selectDateShortcut(index : number, shortcut : string) {
   this.highlightDateBtn(index);
   this.selectDate(shortcut);
  }

  highlightDateBtn (index : number) {
    let list =  this.dateBtnsViewsComputed();
    list.forEach((item : any) => { item.selected = false;})
    list[index]['selected'] = true;
  }

  selectDate(shortcut : string) {
    let initialDay = this.selectedDate() || new Date();
    switch (shortcut) {
      case "Today" : 
        this.selectedDate.set(new Date());
        this.calendar.activeDate = this.selectedDate();
      break;
      case "Next Monday" : 
        let nextMon = this.getNextDayOfTheWeek('monday', true, initialDay)
        this.calendar.activeDate = this.selectedDate();
        this.selectedDate.set(nextMon);

      break;
      case "Next Tuesday" : 
        let nextTue = this.getNextDayOfTheWeek('tuesday', true, initialDay)
        this.calendar.activeDate = this.selectedDate();
        this.selectedDate.set(nextTue);
       
       
      break;
      case "After 1 week" : 
        let nextWeek = new Date(initialDay.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.selectedDate.set(nextWeek);
        this.calendar.activeDate = this.selectedDate();
      break;
      case "No Date" :
          this.selectedDate.set(null);
      break;
    }
  }

  getNextDayOfTheWeek(dayName : string, excludeToday = true, refDate : Date) {
      const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
                        .indexOf(dayName.slice(0,3).toLowerCase());
      if (dayOfWeek < 0) return;
      refDate.setHours(0,0,0,0);
      refDate.setDate(refDate.getDate() + +!!excludeToday + 
                      (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
      return new Date(refDate);
  }



  
  onDialogAction(action:string) {  
    let dateUTC =  (this.selectedDate() && this.selectedDate().toUTCString()) || null;
    let dateTextLocal = this.dateTextLocal();
    let payload = JSON.stringify({ action , dateUTC , dateTextLocal , type : this.data.type})
    this.dialogRef.close(payload); 
  }



}
