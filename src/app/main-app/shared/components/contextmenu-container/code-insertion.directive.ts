import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCodeInsertion]'
})
export class CodeInsertionDirective {

  constructor(public vcr: ViewContainerRef) { }

}
