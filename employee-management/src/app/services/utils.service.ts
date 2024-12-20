import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, interval, throttle } from 'rxjs';
import { monthsShort } from '../constants/utilConstants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  screenSizeStream$ = new BehaviorSubject({
    height : window.innerHeight,
    width : window.innerHeight
  });

  constructor() { 
    fromEvent(window, 'resize').pipe(
      throttle(()=> interval(1000))
    ).subscribe((event: any) => {
       this.screenSizeStream$.next({
        height : window.innerHeight,
        width : window.innerWidth
       })
    });
    
   
  }



  getScreenRange(width?:number) {
    width = width || window.innerWidth;
    if (width <= 768) {
        return "small";
      } else if (width > 768 && width <= 1024) {
        return "mid";
      } else {
        return "large";
      }
  }

  getLocalDateText(UTCString : string) {
    let dateObj = new Date(UTCString);
    const day = this.getDate(dateObj);
    const month = this.getMonthName(dateObj);
    const year = this.getFullYear(dateObj);
    
    return `${day} ${month} ${year}`
  }
  
  getDate(dateObj : Date) {
    return dateObj.getDate();
  }
  
  getMonthName(dateObj : Date) {
    return monthsShort[dateObj.getMonth()]
  }
  
  getFullYear(dateObj : Date) {
    return dateObj.getFullYear();
  }

  getUUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }


}
