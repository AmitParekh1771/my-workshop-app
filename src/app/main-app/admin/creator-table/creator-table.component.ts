import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextmenuConfig } from '../../shared/components/contextmenu-container/contextmenu-config';
import { ContextmenuService } from '../../shared/components/contextmenu-container/contextmenu-container';
import { ContextmenuRef } from '../../shared/components/contextmenu-container/contextmenu-ref';
import { PopupConfirmService } from '../../shared/components/popup-container/popup-container.component';
import { Creator } from '../../shared/models/user.model';
import { CreatorService } from '../../shared/services/creator.service';
import { WorkshopService } from '../../shared/services/workshop.service';
import Utils from '../../shared/utils/utility-function';

@Component({
  selector: 'app-creator-table',
  templateUrl: './creator-table.component.html',
  styleUrls: ['./creator-table.component.css']
})
export class CreatorTableComponent implements OnInit {

  constructor(
    private creatorService: CreatorService,
    private contextmenuService: ContextmenuService,
    private el: ElementRef
  ) { }

  ngOnInit(): void { 
    this.queryChanged();
  }
 
  creators$: Observable<(Creator & {id: string})[]>;

  get pageSize(): string {
    return this.creatorService.limit;
  }
  set pageSize(limit: string) {
    this.creatorService.limit = limit;
  }

  get queryString(): string {
    return this.creatorService.queryString;
  }
  set queryString(query: string) {
    this.creatorService.queryString = query;
  }

  get currentPage(): number {
    return this.creatorService.currentPage;
  }

  filter() {
    let filters = this.queryString.split('&&').map(filter => filter.split('=='));
    
    this.creatorService.filterObj = {};
    filters.forEach(filter => {
      const key = filter[0].trim();
      if(key == 'email' || key == 'name')
        this.creatorService.filterObj[key] = filter[1].trim();
      else if(key == 'wids')
        this.creatorService.filterObj[key] = filter[1].split(',').map(id => id.trim());
    });
    this.queryChanged();
  }

  paginateAfter() {
    this.creatorService.firstCreatorSnap = undefined;
    this.creators$ = this.creatorService.queryCreators('forward');
  }

  paginateBefore() {
    this.creatorService.lastCreatorSnap = undefined;
    this.creators$ = this.creatorService.queryCreators('backward');
  }

  queryChanged() {
    this.creatorService.firstCreatorSnap = undefined;
    this.creatorService.lastCreatorSnap = undefined;
    this.creators$ = this.creatorService.queryCreators('still');
  }

  onContextmenu($event: MouseEvent) {
    const item = Utils.selectElement($event.target as HTMLElement, item => item.hasAttribute('data-creator-item'));

    if(!item) return;

    $event.stopImmediatePropagation();
    $event.preventDefault();

    const cid = item.getAttribute('data-creator-cid') || '';
    const name = item.getAttribute('data-creator-name') || '';
    const email = item.getAttribute('data-creator-email') || '';

    this.contextmenuService.open(CreatorTableContextmenuComponent, {
      clientX: $event.clientX,
      clientY: $event.clientY,
      data: {cid, name, email}
    });

  }

  getCSV() {
    const items = this.el.nativeElement.querySelectorAll('[data-creator-item]') as HTMLElement[];
    const csvHead = "data:text/csv;charset=utf-8,";
    let csvData = "";

    items.forEach(item => {
      const cid = `${item.getElementsByClassName('creator-sr-no')[0].textContent}`;
      const name = `${item.getElementsByClassName('creator-name')[0].textContent}`;
      const email = `${item.getElementsByClassName('creator-email-id')[0].textContent}`;
      csvData += `${cid},${name},${email}\n`;
    });

    navigator.clipboard.writeText(csvData);
    let encodeUri = encodeURI(csvHead + csvData);
    let a = document.createElement('a');
    a.setAttribute('href', encodeUri);
    a.setAttribute('download', `creator-${new Date().getTime()}`);
    this.el.nativeElement.appendChild(a);
    a.click();
    this.el.nativeElement.removeChild(a);
  }


}


@Component({
  selector: 'app-creator-table-contextmenu',
  templateUrl: './creator-table-contextmenu.component.html',
  styleUrls: ['./creator-table.component.css']
})
export class CreatorTableContextmenuComponent {
  constructor(
    @Inject(ContextmenuConfig) 
    public data: {
      cid: string, 
      name: string, 
      email: string
    },
    @Inject(ContextmenuRef) 
    private contextmenuRef: ContextmenuRef<any>,
    private creatorService: CreatorService,
    private workshopService: WorkshopService,
    private popupConfirm: PopupConfirmService
  ) { }

  addWid: string;
  removeWid: string;

  updateCreator() {
    this.contextmenuRef.close();
    if(this.addWid) this.workshopService.addToWids(`creators/${this.data.cid}`, this.addWid);
    if(this.removeWid) this.workshopService.removeFromWids(`creators/${this.data.cid}`, this.removeWid);
  }

  deleteCreator() {
    this.contextmenuRef.close();
    this.popupConfirm.open({
      type: 'Delete',
      title: 'Delete Confirmation',
      highlightColor: '#b00020',
      highlightComplementColor: '#fff',
      confirmMessage: this.data.email,
      warningMessage: 'Are you sure! You want to delete creator? Only creator access will be removed.',
      callBack: (val: boolean) => {
        if(!val) return;

        this.creatorService.removeCreatorAccess(this.data.cid);
      }
    });
  }

}
