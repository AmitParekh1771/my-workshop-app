import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkshopRoutingModule } from './workshop-routing.module';
import { WorkshopComponent } from './workshop.component';
import { WorkshopListComponent, WorkshopListStatusWiseComponent } from './workshop-list/workshop-list.component';
import { WorkshopMainComponent } from './workshop-main/workshop-main.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WorkshopComponent,
    WorkshopListComponent,
    WorkshopMainComponent,
    WorkshopListStatusWiseComponent
  ],
  imports: [
    CommonModule,
    WorkshopRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class WorkshopModule { }
