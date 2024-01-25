
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { InputContainerModule } from '../shared/components/input-container/input-container.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserInfoCardComponent } from './user-info-card/user-info-card.component';
import { UserDetailsFormComponent } from './user-details-form/user-details-form.component'
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AccountComponent,
    UserInfoCardComponent,
    UserDetailsFormComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    InputContainerModule,
    ReactiveFormsModule,
    MatTooltipModule,
    SharedModule
  ]
})
export class AccountModule { }
