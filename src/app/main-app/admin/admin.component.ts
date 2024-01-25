import { AdminService } from './../shared/services/admin.service';
import { CreatorService } from './../shared/services/creator.service';
import { WorkshopService } from './../shared/services/workshop.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(
    public workshopService: WorkshopService,
    public userService: UserService,
    public creatorService: CreatorService,
    public adminService: AdminService
  ) { }


}
