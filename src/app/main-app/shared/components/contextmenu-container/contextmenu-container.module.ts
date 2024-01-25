import { CodeInsertionDirective } from './code-insertion.directive';
import { CommonModule } from '@angular/common';
import { InputContainerModule } from './../input-container/input-container.module';
import { NgModule } from "@angular/core";
import { ContextmenuContainerComponent, ContextmenuService } from './contextmenu-container';


@NgModule({
    declarations: [
        ContextmenuContainerComponent,
        CodeInsertionDirective
    ],
    imports: [
        InputContainerModule,
        CommonModule
    ],
    providers: [
        ContextmenuService
    ]
})
export class ContextmenuContainerModule { }