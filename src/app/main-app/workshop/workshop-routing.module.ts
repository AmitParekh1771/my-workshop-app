import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkshopListComponent, WorkshopListStatusWiseComponent } from './workshop-list/workshop-list.component';
import { WorkshopMainComponent } from './workshop-main/workshop-main.component';
import { WorkshopComponent } from './workshop.component';

const routes: Routes = [
  { 
    path: '', 
    component: WorkshopComponent, 
    children: [
      { path: '', component: WorkshopListComponent },
      { path: ':status', component: WorkshopListStatusWiseComponent},
      { path: ':id/:title', component: WorkshopMainComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }
