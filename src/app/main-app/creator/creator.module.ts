import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatorRoutingModule } from './creator-routing.module';
import { CreatorComponent } from './creator.component';
import { CreatorWorkshopListComponent, CreatorWorkshopListStatusWiseComponent } from './creator-workshop-list/creator-workshop-list.component';
import { CreatorWorkshopMainComponent } from './creator-workshop-main/creator-workshop-main.component';
import { WorkshopContainerModule } from '../shared/components/workshop-container/workshop-container.module';
import { SharedModule } from '../shared/shared.module';
import { PopupContainerModule } from '../shared/components/popup-container/popup-container.module';
import { ManageVideosComponent } from '../shared/components/manage-videos/manage-videos.component';


@NgModule({
  declarations: [
    CreatorComponent,
    CreatorWorkshopListComponent,
    CreatorWorkshopMainComponent,
    CreatorWorkshopListStatusWiseComponent,
    ManageVideosComponent
  ],
  imports: [
    CommonModule,
    CreatorRoutingModule,
    WorkshopContainerModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule,
    PopupContainerModule
  ]
})
export class CreatorModule { }
