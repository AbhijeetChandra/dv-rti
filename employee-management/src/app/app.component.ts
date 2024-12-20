import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsService } from './services/utils.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'employee-management';
  size = signal('small');

  constructor(private utilsService : UtilsService) {
  }

  ngOnInit() {
    this.utilsService.screenSizeStream$.subscribe(dim => {
      this.size.set( this.utilsService.getScreenRange());
    })
  }

  ngOnDestroy() {
    this.utilsService.screenSizeStream$.unsubscribe();
  }
  
}
