import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  @Input('isActive') isActive = false;
  @Output('isActiveChange') isActiveChange = new EventEmitter();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  creatorAccess$: Observable<boolean> = this.authService.isCreator$;

  adminAccess$: Observable<boolean> = this.authService.isAdmin$;

  toggle() {
    this.isActive = !this.isActive;
    this.isActiveChange.emit(this.isActive);
  }

  hideMenu() {
    this.isActive = false;
    this.isActiveChange.emit(false);
  }

  signOut() {
    this.authService.authSignout();
  }


}
