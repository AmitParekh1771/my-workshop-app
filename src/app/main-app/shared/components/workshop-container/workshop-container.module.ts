import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputContainerModule } from '../input-container/input-container.module';
import { WorkshopMetaComponent } from './workshop-meta';
import { ContentEditDirective, ContextMenuComponent } from './workshop-content-edit.directive';
import { WorkshopSetupComponent } from './workshop-setup.component';
import { StatusChangeDirective, WorkshopCardContextMenuComponent } from './workshop-card-context-menu';
import { ContextmenuContainerModule } from '../contextmenu-container/contextmenu-container.module';



@NgModule({
  declarations: [
    ContentEditDirective,
    ContextMenuComponent,
    WorkshopMetaComponent,
    WorkshopSetupComponent,
    WorkshopCardContextMenuComponent,
    StatusChangeDirective
  ],
  imports: [
    CommonModule,
    InputContainerModule,
    FormsModule,
    ReactiveFormsModule,
    ContextmenuContainerModule
  ],
  exports: [
    ContentEditDirective,
    WorkshopMetaComponent,
    WorkshopSetupComponent,
    StatusChangeDirective
  ]
})
export class WorkshopContainerModule { }
