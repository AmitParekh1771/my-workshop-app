import { AppModule } from './../../../app.module';

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: AppModule
})
export class SpinnerService {

  constructor() { }

  spinner = new Subject<boolean>();

  startSpinner() {
    this.spinner.next(true);
  }

  stopSpinner() {
    this.spinner.next(false);
  }
}
