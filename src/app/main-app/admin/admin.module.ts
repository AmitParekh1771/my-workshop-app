import { ContextmenuContainerModule } from './../shared/components/contextmenu-container/contextmenu-container.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserTableComponent, UserTableContextmenuComponent } from './user-table/user-table.component';
import { InputContainerModule } from '../shared/components/input-container/input-container.module';
import { SharedModule } from '../shared/shared.module';
import { WorkshopTableComponent, WorkshopTableContextmenuComponent } from './workshop-table/workshop-table.component';
import { CreatorTableComponent, CreatorTableContextmenuComponent } from './creator-table/creator-table.component';
import { AdminTableComponent } from './admin-table/admin-table.component';


@NgModule({
  declarations: [
    AdminComponent,
    UserTableComponent,
    WorkshopTableComponent,
    CreatorTableComponent,
    AdminTableComponent,
    UserTableContextmenuComponent,
    WorkshopTableContextmenuComponent,
    CreatorTableContextmenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    InputContainerModule,
    SharedModule,
    ContextmenuContainerModule
  ]
})
export class AdminModule { }
