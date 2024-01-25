import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { STATUS } from "src/assets/data/status";
import { BaseControlValueAccessor } from "../../base-class/base-control-value-accessor";
import { Status } from "../../models/workshop.model";


@Component({
    selector: 'app-workshop-setup',
    templateUrl: './workshop-setup.component.html',
    styleUrls: ['./workshop-setup.component.css'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WorkshopSetupComponent),
        multi: true
      }
    ]
})
export class WorkshopSetupComponent 
extends BaseControlValueAccessor<Status> {
    constructor() { 
      super();
    }
    
    showOptions: boolean = false;

    @Output('launchAgain') launchAgain = new EventEmitter<null>();

    @Output('deleteWorkshop') deleteWorkshop = new EventEmitter<null>();

    @Output('saveChanges') saveChanges = new EventEmitter<null>();

    @Output('revertChanges') revertChanges = new EventEmitter<null>();

    @Input('disableSaveAndRevert') disableSaveAndRevert: boolean;

    status: Status[] = STATUS;

    selectOption(option: Status | null) {
      this.value = option;
      this.showOptions = false;
    }

}