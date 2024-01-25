import { Item } from './../../models/workshop.model';
import { Component, OnInit, Inject, ElementRef } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'cover-video',
  template: `
  <div style="padding-top:56.27659574468085%" class="w-video w-embed loader">
    <iframe class="embedly-embed" scrolling="no" allowfullscreen title="Cover Video"></iframe>
  </div>
  `
})
export class CoverVideoPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Item,
    public el: ElementRef) { }

    ngOnInit(): void {
      this.el.nativeElement.querySelector('iframe').src = this.data.embedUrl;  
    }
}
  
  