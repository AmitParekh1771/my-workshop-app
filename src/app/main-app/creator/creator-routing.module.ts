
import { CreatorWorkshopMainComponent } from './creator-workshop-main/creator-workshop-main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatorWorkshopListComponent, CreatorWorkshopListStatusWiseComponent } from './creator-workshop-list/creator-workshop-list.component';
import { CreatorComponent } from './creator.component';

const routes: Routes = [
  { 
    path: '', 
    component: CreatorComponent,
    children: [
      { path: '', component: CreatorWorkshopListComponent },
      { path: ':status', component: CreatorWorkshopListStatusWiseComponent },
      { path: ':id/:title', component: CreatorWorkshopMainComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatorRoutingModule { }
