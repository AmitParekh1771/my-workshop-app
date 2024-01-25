import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { 
  InputTemplateComponent, 
  TextInputComponent, 
  PasswordInputComponent, 
  SingleSelectInputComponent, 
  MultiSelectInputComponent, 
  DateInputComponent, 
  ColorInputComponent,
  AttachmentInputComponent
} from './input-container.component';

@NgModule({
  declarations: [
    InputTemplateComponent,
    TextInputComponent,
    AttachmentInputComponent,
    PasswordInputComponent,
    ColorInputComponent,
    SingleSelectInputComponent,
    MultiSelectInputComponent,
    DateInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    TextInputComponent,
    AttachmentInputComponent,
    PasswordInputComponent,
    ColorInputComponent,
    SingleSelectInputComponent,
    MultiSelectInputComponent,
    DateInputComponent
  ]
})
export class InputContainerModule { }
