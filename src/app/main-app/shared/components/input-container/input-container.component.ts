import { Item } from './../../models/workshop.model';
import { 
  Component, 
  ElementRef, 
  forwardRef, 
  HostBinding, 
  HostListener, 
  Input, 
  Output, 
  OnInit, 
  ViewChild, 
  EventEmitter,
  ViewContainerRef,
  TemplateRef,
  OnChanges
} from '@angular/core';
import { BaseControlValueAccessor } from '../../base-class/base-control-value-accessor';
import { MatCalendar } from '@angular/material/datepicker';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import Utils from '../../utils/utility-function';
import { SelectItem } from '../../models/select-item.model';
import { Timestamp } from '../../models/form-data-model';

@Component({
  selector: 'app-input-template',
  templateUrl: './input-template.component.html',
  styleUrls: ['./input-container.component.css']
})
export class InputTemplateComponent { }


@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent 
extends BaseControlValueAccessor<string> {

  constructor(public el: ElementRef) {
    super();
  }

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @HostBinding('tabindex') tabindex = "0";
  
  @HostListener('focusin')
  onFocus() {
    this.inputFocus = true;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
  }

  @HostListener('focusout')
  onBlur() {
    this.inputFocus = false;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
  }
  
  type: string = "text";
  
  inputFocus: boolean = false;

  

}

@Component({
  selector: 'app-attachment-input',
  templateUrl: './attachment-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttachmentInputComponent),
      multi: true
    }
  ]
})
export class AttachmentInputComponent 
extends BaseControlValueAccessor<Item> {

  constructor(public el: ElementRef) {
    super();
  }

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @Output('attach') attach = new EventEmitter<File>();

  @Output('uriChange') uriChange = new EventEmitter<string>(); 

  @HostBinding('tabindex') tabindex = "0";
  
  @HostListener('focusin')
  onFocus() {
    this.inputFocus = true;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
  }

  @HostListener('focusout')
  onBlur() {
    this.inputFocus = false;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
  }

  type: string = "text";
  
  inputFocus: boolean = false;

  attachItem($event: Event) {
    this.inputFocus = !this.disabled;
    const file = ($event.target as HTMLInputElement).files?.item(0);
    
    if(file) this.attach.emit(file);
  }

}

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent 
extends BaseControlValueAccessor<string> {

  constructor(public el: ElementRef) {
    super();
  }

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @HostBinding('tabindex') tabindex = "0";

  @HostListener('focusin')
  onFocus() {
    this.inputFocus = true;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
  }

  @HostListener('focusout')
  onBlur() {
    this.inputFocus = false;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
  }

  type: string = "password";
  
  inputFocus: boolean = false;
  
  toggleType() {
    this.type = this.type === "password" ? "text" : "password";
  }

}

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorInputComponent),
      multi: true
    }
  ]
})
export class ColorInputComponent 
extends BaseControlValueAccessor<string> {

  constructor(public el: ElementRef) {
    super();
  }

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @HostBinding('tabindex') tabindex = "0";

  @HostListener('focusin')
  onFocus() {
    this.inputFocus = true;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
  }

  @HostListener('focusout')
  onBlur() {
    this.inputFocus = false;
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
  }
  
  type: string = "text";
  
  inputFocus: boolean = false;
  
}


class SelectInputComponent<T> 
extends BaseControlValueAccessor<T> {

  constructor(public el: ElementRef) { 
    super();
  }

  type: string = "text";
  
  inputFocus: boolean = false;
  
  inputText: string | undefined;

  mouseDownHappened = false;
  
  buildInterval: any;
  
  focusedItem: SelectItem = { id: -1, name: ""};

  toggleItems: boolean = false;

  navigateItems(step: number) {
    let items = this.el.nativeElement
      .querySelectorAll('.select-option-item') as HTMLElement[];
    let n = items.length;
    let i = 0;

    i = this.focusedItemIndex(items, n);
    
    (i<n && i>-1) ? items[i].classList.remove('hovered-select-item') : null;
    
    i = Utils.cyclicIterator(i, n, step);
 
    this.focusItem(items[i]);
  }

  focusItem(item: HTMLElement) {
    item.classList.add('hovered-select-item');
    item.scrollIntoView({block: "nearest", inline: "nearest"});
    
    this.focusedItem.id = item.getAttribute('data-item-id')!;
    this.focusedItem.name = item.getAttribute('data-item-name')!;
  }

  focusedItemIndex(items: HTMLElement[], n: number) {
    let i=-1;
    for(i=0 ; i<n ; ++i) {
      if(items[i].classList.contains('hovered-select-item'))
        return i;
    }
    return n;
  }
  
  filterItems($event: KeyboardEvent) {
    if($event.key == "ArrowDown" || $event.key == "ArrowUp" || $event.key == "Enter")
      return;

    if(this.inputText === undefined)
      return;

    let items = this.el.nativeElement
      .querySelectorAll('.select-option-item') as HTMLElement[];
    let n = items.length;
    let i = 0;

    i = this.focusedItemIndex(items, n);
    
    (i<n && i>-1) ? items[i].classList.remove('hovered-select-item') : null;

    let minEdit = 100, h = 0;

    for(i=0 ; i<n ; ++i) {
      let itemText = items[i].getAttribute('data-item-name') || '';
      let edits = Utils.editDistance(itemText, this.inputText);
      if(edits < minEdit && Utils.isSubsequence(itemText, this.inputText)) {
        minEdit = edits;
        h = i;
      }
    }

    items[h].scrollIntoView({block: "nearest", inline: "nearest"});
    this.focusItem(items[h]);
    
  }

}

@Component({
  selector: 'app-single-select-input',
  templateUrl: './single-select-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectInputComponent),
      multi: true
    }
  ]
})
export class SingleSelectInputComponent<T extends SelectItem> 
extends SelectInputComponent<T> 
implements OnChanges {

  @ViewChild('selectContainer', {read: ViewContainerRef}) selectContainer: ViewContainerRef;

  @ViewChild('selectTemplate', {read: TemplateRef}) selectTemplate: TemplateRef<{item: T}>;

  constructor(public el: ElementRef) {
    super(el);
    
    this.valChange = (val: T) => {
      if(!val) {
        this.inputText = '';
        return;
      }

      this.inputText = val.name!;
      let items = this.el.nativeElement
        .querySelectorAll('.select-option-item') as HTMLElement[];
      
      if(!Array.isArray(items))
        return;
      let item = items.find(item => item.id == val.id)!;
      
      item.scrollIntoView({block: "nearest", inline: "nearest"});
      this.focusItem(item);
    }
  
  }

  @Input('selectItems') selectItems: T[] | null = [];

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @HostBinding('tabindex') tabindex = "0";

  @HostListener('focusin')
  onFocus() {
    (this.el.nativeElement as HTMLElement).style.zIndex = "2";
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
    this.inputFocus = true;
    this.mouseDownHappened = false;
  }

  @HostListener('focusout')
  onBlur() {
    if(this.mouseDownHappened) { 
      this.mouseDownHappened = false;
      return;
    }
    (this.el.nativeElement as HTMLElement).style.zIndex = "1";
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
    this.inputFocus = false;
  }

  ngOnChanges(): void {
    this.buildData();
  }
  
  private buildData() {
    const ITEMS_RENDERED_AT_ONCE = 50;
    const INTERVAL_DELAY = 1000;
    const SIZE = this.selectItems!.length;

    this.selectContainer ? this.selectContainer.clear() : null;

    let currentIndex = 0;

    clearInterval(this.buildInterval);

    this.buildInterval = setInterval(() => {
      const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

      for(let i=currentIndex ; i < nextIndex ; ++i) {
        if(i >= SIZE) {
          clearInterval(this.buildInterval);
          break;
        }
        this.selectContainer.createEmbeddedView(this.selectTemplate, {
          item: this.selectItems![i]
        });
      }

      currentIndex += ITEMS_RENDERED_AT_ONCE;

    }, INTERVAL_DELAY);
  }

  checkText($event: string) {
    this.inputText = $event;
    if(this.focusedItem.name !== $event || !$event) {
      this.focusedItem = {id: -1, name: ""};
      this.value = null;
    }
  }

  selectItem(item?: T) {
    if(this.disabled || this.readonly) return;
    
    if(item == undefined)
      this.value = this.selectItems!.find(item => item.id == this.focusedItem.id)!;
    else
      this.value = item!;
    this.inputText = this.value.name!;
    this.inputFocus = this.toggleItems = false;
  }

} 

@Component({
  selector: 'app-multi-select-input',
  templateUrl: './multi-select-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectInputComponent),
      multi: true
    }
  ]
})
export class MultiSelectInputComponent<T extends SelectItem> 
extends SelectInputComponent<T[]> 
implements OnInit, OnChanges {

  @ViewChild('selectContainer', {read: ViewContainerRef}) selectContainer: ViewContainerRef;

  @ViewChild('selectTemplate', {read: TemplateRef}) selectTemplate: TemplateRef<{item: T, index:number}>;

  constructor(public el: ElementRef) {
    super(el);
    
    this.valChange = (val: T[]) => {
      let i = 0, j = 0;
      for(i=0 ; i<this.selectItems!.length ; ++i)
        this.visibleItems[i] = true;

      if(!val)
        return;
      
      for(i=0 ; i<this.selectItems!.length ; ++i) {
        if(!val[j])
          return;
        else if(this.selectItems![i].id == val[j].id) {
          this.visibleItems[i] = false;
          ++j;
        }
      }
    }
  
  }
  
  @Input('selectItems') selectItems: T[] | null = [];

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @Output('added') added = new EventEmitter<T>();

  @Output('removed') removed = new EventEmitter<T>();

  @HostBinding('tabindex') tabindex = "0";

  @HostListener('focusin')
  onFocus() {
    (this.el.nativeElement as HTMLElement).style.zIndex = "2";
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
    this.inputFocus = true;
    this.mouseDownHappened = false;
  }

  @HostListener('focusout')
  onBlur() {
    if(this.mouseDownHappened) { 
      this.mouseDownHappened = false;
      return;
    }
    (this.el.nativeElement as HTMLElement).style.zIndex = "1";
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
    this.inputFocus = false;
  }

  visibleItems: boolean[];

  ngOnInit(): void {
    this.visibleItems = Array(this.selectItems!.length).fill(true); 
  }

  ngOnChanges(): void {
    this.buildData();
  }

  private buildData() {
    const ITEMS_RENDERED_AT_ONCE = 50;
    const INTERVAL_DELAY = 1000;
    const SIZE = this.selectItems!.length;

    this.selectContainer ? this.selectContainer.clear() : null;
    
    let currentIndex = 0;

    clearInterval(this.buildInterval);

    this.buildInterval = setInterval(() => {
      const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

      for(let i=currentIndex ; i < nextIndex ; ++i) {
        if(i >= SIZE) {
          clearInterval(this.buildInterval);
          break;
        }
        this.selectContainer.createEmbeddedView(this.selectTemplate, {
          item: this.selectItems![i],
          index: i
        });
      }

      currentIndex += ITEMS_RENDERED_AT_ONCE;
    }, INTERVAL_DELAY);
  }

  addItem(item?: T) {
    if(this.disabled || this.readonly) return;

    if(item == undefined) {
      item = this.selectItems!.find(item => item.id == this.focusedItem.id);
    }
    
    if(item && !this.isSelected(item)) {
      this.value?.push(item);

      let index = this.selectItems!.indexOf(item);
      this.visibleItems[index] = false;

      this.onChange(this.value);

      this.added.emit(item);
    }
  }

  removeItem(item: T) {
    if(this.disabled || this.readonly) return;
    
    let index = this.value?.indexOf(item) || 0;
    this.value?.splice(index, 1);

    index = this.selectItems!.findIndex(value => value.id == item.id);
    this.visibleItems[index] = true;

    this.onChange(this.value);

    this.removed.emit(item);
  }

  private isSelected(item: T) {
    return this.value?.includes(item);
  }

} 

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./input-container.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})
export class DateInputComponent 
extends BaseControlValueAccessor<Timestamp> {

  constructor(public el: ElementRef) {
    super();
    this.valChange = (val: Timestamp) => {
      if(!val) return;
      
      const date = new Date(val.seconds * 1000);
      this.inputText = `${date.getDate()} / ${date.getMonth()+1} / ${date.getFullYear()}`;
    }
  }
  
  @ViewChild('datepicker', { static: false }) matCalendar: MatCalendar<Date>;

  @Input('name') name: string = "field";

  @Input('error') error: boolean = false;

  @Input('placeholder') placeholder: string = '';
  
  @Input('autocomplete') autocomplete: string = "off";

  @Input('readonly') readonly: boolean = false;

  @HostBinding('tabindex') tabindex = "0";

  @HostListener('focusin')
  onFocus() {
    (this.el.nativeElement as HTMLElement).style.zIndex = "2";
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#333';
    this.inputFocus = true;
    this.mouseDownHappened = false;
  }

  @HostListener('focusout')
  onBlur() {
    if(this.mouseDownHappened) { 
      this.mouseDownHappened = false;
      return;
    }
    (this.el.nativeElement as HTMLElement).style.zIndex = "1";
    (this.el.nativeElement.querySelector('.focusing-area') as HTMLElement).style.borderColor = this.error ? '#b00020' : '#dfdfdf';
    this.inputFocus = false;
  }

  type: string = "text";
  
  inputFocus: boolean = false;

  mouseDownHappened = false;

  inputText: string | undefined;

  toggleDatepicker: boolean = false;

  set date(val: Date | null) {
    this.inputText = '';
    if(!val) {
      this.value = null;
      return;
    }
    
    this.value = Timestamp.fromDate(val);
  }

  get date() {
    if(!this.value) return null;
    return new Date(this.value.seconds * 1000);
  }

  setDate() {
    let d = this.inputText?.split('/');
    if(d && d.length == 3)
      this.date = new Date(d[1] + '/' + d[0] + '/' + d[2]);
    else
      this.date = null;
  }

  focusDate() {
    this.matCalendar.activeDate = this.date || new Date();
    this.matCalendar.updateTodaysDate();
  }

}