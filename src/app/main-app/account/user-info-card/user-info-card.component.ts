import { Component, Input } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.css']
})
export class UserInfoCardComponent {

  constructor() { }

  @Input('user') user: User;


}
