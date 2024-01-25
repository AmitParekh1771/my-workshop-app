import { UserService } from './../shared/services/user.service';

import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  constructor(private userService: UserService) {}

  user$ = this.userService.getMe();
}
