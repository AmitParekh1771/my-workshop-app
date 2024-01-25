import { ControlValueAccessor } from "@angular/forms";

export class BaseControlValueAccessor<T> implements ControlValueAccessor {

  val: T | null;

  disabled: boolean = false;

  onChange: any = () => {};

  valChange: any = () => {};

  onTouch: any = () => {};

  set value(val: T | null) {
    if(val !== undefined && val !== this.val) {
      this.val = val;
  
      this.onChange(val);
      
      this.onTouch(val);

      this.valChange(val);
    }
  }

  get value() {
    return this.val;
  }

  writeValue(obj: T | null): void {
    this.value = obj;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void { 
    this.disabled = isDisabled; 
  }
  
}
  