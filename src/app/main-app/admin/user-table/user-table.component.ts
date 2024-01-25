import { WorkshopService } from './../../shared/services/workshop.service';
import { PopupConfirmService } from './../../shared/components/popup-container/popup-container.component';
import { ContextmenuConfig } from './../../shared/components/contextmenu-container/contextmenu-config';
import { ContextmenuService } from './../../shared/components/contextmenu-container/contextmenu-container';
import { UserService } from './../../shared/services/user.service';
import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import Utils from '../../shared/utils/utility-function';
import { ContextmenuRef } from '../../shared/components/contextmenu-container/contextmenu-ref';
import { CreatorService } from '../../shared/services/creator.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  constructor(
    private userService: UserService,
    private contextmenuService: ContextmenuService,
    private el: ElementRef
  ) { }

  ngOnInit(): void { 
    this.queryChanged();
  }
 
  users$: Observable<(User & {id: string})[]>;

  get pageSize(): string {
    return this.userService.limit;
  }
  set pageSize(limit: string) {
    this.userService.limit = limit;
  }

  get queryString(): string {
    return this.userService.queryString;
  }
  set queryString(query: string) {
    this.userService.queryString = query;
  }

  get currentPage(): number {
    return this.userService.currentPage;
  }

  filter() {
    let filters = this.queryString.split('&&').map(filter => filter.split('=='));
    
    this.userService.filterObj = {};
    filters.forEach(filter => {
      const key = filter[0].trim();
      if(key == 'email' || key == 'firstName')
        this.userService.filterObj[key] = filter[1].trim();
      else if(key == 'wids')
        this.userService.filterObj[key] = filter[1].split(',').map(id => id.trim());
    });
    this.queryChanged();
  }

  paginateAfter() {
    this.userService.firstUserSnap = undefined;
    this.users$ = this.userService.queryUsers('forward');
  }

  paginateBefore() {
    this.userService.lastUserSnap = undefined;
    this.users$ = this.userService.queryUsers('backward');
  }

  queryChanged() {
    this.userService.firstUserSnap = undefined;
    this.userService.lastUserSnap = undefined;
    this.users$ = this.userService.queryUsers('still');
  }


  onContextmenu($event: MouseEvent) {
    const item = Utils.selectElement($event.target as HTMLElement, item => item.hasAttribute('data-user-item'));

    if(!item) return;

    $event.stopImmediatePropagation();
    $event.preventDefault();

    const uid = item.getAttribute('data-user-uid') || '';
    const name = item.getAttribute('data-user-name') || '';
    const email = item.getAttribute('data-user-email') || '';

    this.contextmenuService.open(UserTableContextmenuComponent, {
      clientX: $event.clientX,
      clientY: $event.clientY,
      data: {uid, name, email}
    });

  }

  getCSV() {
    const items = this.el.nativeElement.querySelectorAll('[data-user-item]') as HTMLElement[];
    const csvHead = "data:text/csv;charset=utf-8,";
    let csvData = "";

    items.forEach(item => {
      const uid = `${item.getElementsByClassName('user-sr-no')[0].textContent}`;
      const name = `${item.getElementsByClassName('user-first-name')[0].textContent} ${item.getElementsByClassName('user-last-name')[0].textContent}`;
      const email = `${item.getElementsByClassName('user-email-id')[0].textContent}`;
      csvData += `${uid},${name},${email}\n`;
    });

    navigator.clipboard.writeText(csvData);
    let encodeUri = encodeURI(csvHead + csvData);
    let a = document.createElement('a');
    a.setAttribute('href', encodeUri);
    a.setAttribute('download', `user-${new Date().getTime()}`);
    this.el.nativeElement.appendChild(a);
    a.click();
    this.el.nativeElement.removeChild(a);
  }
  
}

@Component({
  selector: 'app-user-table-contextmenu',
  templateUrl: './user-table-contextmenu.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableContextmenuComponent {
  constructor(
    @Inject(ContextmenuConfig) 
    public data: {
      uid: string, 
      name: string, 
      email: string
    },
    @Inject(ContextmenuRef) 
    private contextmenuRef: ContextmenuRef<any>,
    private userService: UserService,
    private creatorService: CreatorService,
    private workshopService: WorkshopService,
    private popupConfirm: PopupConfirmService
  ) { }

  addWid: string;
  removeWid: string;

  makeCreator() {
    this.contextmenuRef.close();
    this.creatorService.giveCreatorAccess(this.data.uid, this.data.name, this.data.email);
  }

  updateUser() {
    this.contextmenuRef.close();
    if(this.addWid) this.workshopService.addToWids(`users/${this.data.uid}`, this.addWid);
    if(this.removeWid) this.workshopService.removeFromWids(`users/${this.data.uid}`, this.removeWid);
  }

  deleteUser() {
    this.contextmenuRef.close();
    this.popupConfirm.open({
      type: 'Delete',
      title: 'Delete Confirmation',
      highlightColor: '#b00020',
      highlightComplementColor: '#fff',
      confirmMessage: this.data.email,
      warningMessage: 'Are you sure! You want to delete user account?',
      callBack: (val: boolean) => {
        if(!val) return;

        this.userService.deleteUser(this.data.uid);
      }
    });
  }

}
