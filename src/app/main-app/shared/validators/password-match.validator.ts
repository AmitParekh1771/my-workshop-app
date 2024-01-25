import { ValidationErrors, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';
import { map, take } from 'rxjs/operators';


export class PasswordMatchValidator {

    static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlName);
            const matchingControl = formGroup.get(matchingControlName);
            
            if(!control!.value && !matchingControl!.value) {
                matchingControl!.setErrors(null);
                return null;
            }
            
            if(control!.value !== matchingControl!.value)
                matchingControl!.setErrors({ mustMatch: true });
            else
                matchingControl!.setErrors(null);
            return null;
        }
    }

    static changePassword(controlName: string, matchingControlName: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlName);
            const matchingControl = formGroup.get(matchingControlName);
                        
            if(!control!.value && !matchingControl!.value) {
                control!.setErrors(null);
                matchingControl!.setErrors(null);
                return null;
            }
            else if(!control!.value)
                control!.setErrors({ changePassword: { required : true } });
            else if(!matchingControl!.value)
                matchingControl!.setErrors({ changePassword: { required : true } });
            else if(control!.value === matchingControl!.value)
                matchingControl!.setErrors({ changePassword: { mustNotMatch: true } });
            return null;
        }
    }

    static incorrectPassword(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return new Observable((subscriber: Subscriber<ValidationErrors|null>) => {
                
                if(!control!.value || (control!.errors && !control!.errors.incorrectPassword))
                    subscriber.next(null);
                
                setTimeout(() => {
                    if(control!.value !== 'oldpassword') {
                        subscriber.next({ incorrectPassword: true });
                    }
                }, 2000);
            }).pipe(map((value: ValidationErrors | null) => {
                return value;
            }), take(1));
        }

    }

}