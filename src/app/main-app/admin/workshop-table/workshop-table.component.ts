import { ContextmenuService } from './../../shared/components/contextmenu-container/contextmenu-container';
import { WorkshopService } from './../../shared/services/workshop.service';
import { Workshop } from './../../shared/models/workshop.model';
import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { ContextmenuConfig } from '../../shared/components/contextmenu-container/contextmenu-config';
import { ContextmenuRef } from '../../shared/components/contextmenu-container/contextmenu-ref';
import { PopupConfirmService } from '../../shared/components/popup-container/popup-container.component';
import { CreatorService } from '../../shared/services/creator.service';
import Utils from '../../shared/utils/utility-function';

@Component({
  selector: 'app-workshop-table',
  templateUrl: './workshop-table.component.html',
  styleUrls: ['./workshop-table.component.css']
})
export class WorkshopTableComponent implements OnInit {

  constructor(
    private workshopService: WorkshopService,
    private contextmenuService: ContextmenuService,
    private el: ElementRef
  ) { }

  ngOnInit(): void { 
    this.queryChanged();
  }
  
  workshops$: Observable<(Workshop & {id: string})[]>;

  get pageSize(): string {
    return this.workshopService.limit;
  }
  set pageSize(limit: string) {
    this.workshopService.limit = limit;
  }

  get queryString(): string {
    return this.workshopService.queryString;
  }
  set queryString(query: string) {
    this.workshopService.queryString = query;
  }

  get currentPage(): number {
    return this.workshopService.currentPage;
  }

  filter() {
    let filters = this.queryString.split('&&').map(filter => filter.split('=='));
    
    this.workshopService.filterObj = {};
    filters.forEach(filter => {
      const key = filter[0].trim();
      if(key == 'courseId')
        this.workshopService.filterObj[key] = filter[1].trim();
      else if(key == 'creatorsId' || key == 'status')
        this.workshopService.filterObj[key] = filter[1].split(',').map(id => id.trim());
    });
    this.queryChanged();
  }

  paginateAfter() {
    this.workshopService.firstWorkshopSnap = undefined;
    this.workshops$ = this.workshopService.queryWorkshops('forward');
  }

  paginateBefore() {
    this.workshopService.lastWorkshopSnap = undefined;
    this.workshops$ = this.workshopService.queryWorkshops('backward');
  }

  queryChanged() {
    this.workshopService.lastWorkshopSnap = undefined;
    this.workshopService.firstWorkshopSnap = undefined;
    this.workshops$ = this.workshopService.queryWorkshops('still');
  }

  onContextmenu($event: MouseEvent) {
    const item = Utils.selectElement($event.target as HTMLElement, item => item.hasAttribute('data-workshop-item'));

    if(!item) return;

    $event.stopImmediatePropagation();
    $event.preventDefault();

    const wid = item.getAttribute('data-workshop-wid') || '';
    const title = item.getAttribute('data-workshop-title') || '';

    this.contextmenuService.open(WorkshopTableContextmenuComponent, {
      clientX: $event.clientX,
      clientY: $event.clientY,
      data: {wid, title}
    });

  }

  getCSV() {
    const items = this.el.nativeElement.querySelectorAll('[data-workshop-item]') as HTMLElement[];
    const csvHead = "data:text/csv;charset=utf-8,";
    let csvData = "";

    items.forEach(item => {
      const uid = `${item.getElementsByClassName('workshop-sr-no')[0].textContent}`;
      const title = `${item.getElementsByClassName('workshop-title')[0].textContent}`;
      const status = `${item.getElementsByClassName('workshop-status')[0].textContent}`;
      csvData += `${uid},${title},${status}\n`;
    });

    navigator.clipboard.writeText(csvData);
    let encodeUri = encodeURI(csvHead + csvData);
    let a = document.createElement('a');
    a.setAttribute('href', encodeUri);
    a.setAttribute('download', `workshop-${new Date().getTime()}`);
    this.el.nativeElement.appendChild(a);
    a.click();
    this.el.nativeElement.removeChild(a);
  }

}


@Component({
  selector: 'app-workshop-table-contextmenu',
  templateUrl: './workshop-table-contextmenu.component.html',
  styleUrls: ['./workshop-table.component.css']
})
export class WorkshopTableContextmenuComponent {
  constructor(
    @Inject(ContextmenuConfig) 
    public data: {
      wid: string, 
      title: string
    },
    @Inject(ContextmenuRef) 
    private contextmenuRef: ContextmenuRef<any>,
    private creatorService: CreatorService,
    private workshopService: WorkshopService,
    private popupConfirm: PopupConfirmService
  ) { }

  addCid: string;
  removeCid: string;

  updateWorkshop() {
    this.contextmenuRef.close();

    if(this.addCid) {
      this.creatorService.getCreator(this.addCid).toPromise()
      .then(creator => this.workshopService.updateWorkshop(`workshops/${this.data.wid}`, {
        creatorsId: firebase.firestore.FieldValue.arrayUnion(this.addCid),
        creators: firebase.firestore.FieldValue.arrayUnion(creator)
      }));
    }
    if(this.removeCid) {
      this.creatorService.getCreator(this.removeCid).toPromise()
      .then(creator => this.workshopService.updateWorkshop(`workshops/${this.data.wid}`, {
        creatorsId: firebase.firestore.FieldValue.arrayRemove(this.removeCid),
        creators: firebase.firestore.FieldValue.arrayRemove(creator)
      }));
      
    }
  }

  deleteWorkshop() {
    this.contextmenuRef.close();
    this.popupConfirm.open({
      type: 'Delete',
      title: 'Delete Confirmation',
      highlightColor: '#b00020',
      highlightComplementColor: '#fff',
      confirmMessage: this.data.title,
      warningMessage: 'Are you sure! You want to delete workshop?',
      callBack: (val: boolean) => {
        if(!val) return;

        this.workshopService.hardDeleteWorkshop(this.data.wid);
      }
    });
  }

}
