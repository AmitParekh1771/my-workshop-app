import { PopupAlertService } from './../../shared/components/popup-container/popup-container.component';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Country, State } from '../../shared/models/form-data-model';
import { User } from '../../shared/models/user.model';
import { FormDataService } from '../../shared/services/form-data.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-details-form.component.css']
})
export class UserDetailsFormComponent implements OnInit {

  constructor(
    public formData: FormDataService,
    private userService: UserService,
    private popupAlert: PopupAlertService
  ) { }

  ngOnInit(): void { 
    this.userObj = {...this.userObj, ...this.user}
    this.form.patchValue(this.userObj);
    this.initialFormVal = this.form.value;
    this.formValueStr = JSON.stringify(this.form.value);

    this.form.get('country')?.valueChanges
      .subscribe((next: Country | null) => {
        this.states$ = this.formData.getStates(next!);
        this.cities$ = this.formData.getCities(next!);
      });
      
    this.form.get('state')?.valueChanges
      .subscribe((next: State | null) => {
        let country: Country | null = this.form.get('country')?.value;
        this.cities$ = this.formData.getCities(country!, next!);
      });

    this.form.valueChanges
      .subscribe((val: any) => {
        this.userObj = { ...this.userObj, ...val };
        
        if(JSON.stringify(val) == this.formValueStr || !this.formValueStr)
          this.disableButton = true;
        else
          this.disableButton = false;
      });
  }

  countries$ = this.formData.getCountries();

  states$ = this.formData.getStates();

  cities$ = this.formData.getCities();

  @Input('user') user: User;

  userObj = new User();

  initialFormVal: any;

  formValueStr: string;

  disableButton = true;

  form = new FormGroup({
    'firstName': new FormControl(null, Validators.required),
    'lastName': new FormControl(null, Validators.required),
    'email': new FormControl(null, Validators.required),
    'dateOfBirth': new FormControl(null),
    'gender': new FormControl(null),
    'profession': new FormControl(null),
    'areaOfInterest': new FormControl([]),
    'country': new FormControl(null),
    'state': new FormControl(null),
    'city': new FormControl(null)
  });

  submit() {
    this.userService.patchMe(this.userObj)
      .then(() => {
        this.disableButton = true;
        this.initialFormVal = this.form.value;
        this.popupAlert.open({
          type: 'SUCCESS',
          title: 'SUCCESS',
          alertMessage: 'Your changes have been saved successfully!'
        })
      })
      .catch((err: any) => {
        this.popupAlert.open({
          type: 'ERROR',
          title: `ERROR: ${err.status}`,
          alertMessage: err.message
        })
      });
  }

  reset() {
    this.form.reset(this.initialFormVal);
    this.disableButton = true;
  }

  errorMessage(field: AbstractControl | null) {
    let requiredMsg = field?.errors?.required ? 
      `This field cannot be empty.\n` : ``;

    let minLengthMsg = field?.errors?.minlength ? 
      `Minimum length of input must be ${field?.errors?.minlength.requiredLength}.\nEnter ${field?.errors?.minlength.requiredLength - field?.errors?.minlength.actualLength} more characters.` : ``;

    return `${requiredMsg}${minLengthMsg}`;
  }

}
