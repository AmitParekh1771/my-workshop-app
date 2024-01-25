import { UploadContainerComponent } from './components/upload-container/upload-container.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { ItemToStringPipe } from './pipes/item-to-string.pipe';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";

import { ScoreContainerComponent } from './components/score-container/score-container.component';
import { WorkshopCardComponent } from './components/workshop-card/workshop-card.component';
import { SafePipe } from './pipes/safe.pipe';


@NgModule({
    declarations: [
        ScoreContainerComponent,
        WorkshopCardComponent,
        UploadContainerComponent,
        ItemToStringPipe,
        FileSizePipe,
        SafePipe
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        ScoreContainerComponent,
        WorkshopCardComponent,
        UploadContainerComponent,
        ItemToStringPipe,
        FileSizePipe,
        SafePipe
    ]
})
export class SharedModule { }