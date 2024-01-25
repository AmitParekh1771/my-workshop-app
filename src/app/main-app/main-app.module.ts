import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppRoutingModule } from './main-app-routing.module';

import { MainAppComponent } from './main-app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    MainAppComponent,
    SideBarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MainAppRoutingModule,
    SharedModule
  ]
})
export class MainAppModule { }
