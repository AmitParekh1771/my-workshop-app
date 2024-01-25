import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../../shared/models/user.model';
import { AdminService } from '../../shared/services/admin.service';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private el: ElementRef
  ) { }

  ngOnInit(): void { 
    this.queryChanged();
  }
 
  admins$: Observable<(Admin & {id: string})[]>;

  get queryString(): string {
    return this.adminService.queryString;
  }
  set queryString(query: string) {
    this.adminService.queryString = query;
  }

  filter() {
    let filters = this.queryString.split('&&').map(filter => filter.split('=='));
    
    this.adminService.filterObj = {};
    filters.forEach(filter => {
      const key = filter[0].trim();
      if(key == 'email' || key == 'name')
        this.adminService.filterObj[key] = filter[1].trim();
      else if(key == 'wids')
        this.adminService.filterObj[key] = filter[1].split(',').map(id => id.trim());
    });
    this.queryChanged();
  }

  queryChanged() {
    this.admins$ = this.adminService.queryAdmins();
  }

  getCSV() {
    const items = this.el.nativeElement.querySelectorAll('[data-admin-item]') as HTMLElement[];
    const csvHead = "data:text/csv;charset=utf-8,";
    let csvData = "";

    items.forEach(item => {
      const aid = `${item.getElementsByClassName('admin-sr-no')[0].textContent}`;
      const name = `${item.getElementsByClassName('admin-name')[0].textContent}`;
      const email = `${item.getElementsByClassName('admin-email-id')[0].textContent}`;
      csvData += `${aid},${name},${email}\n`;
    });

    navigator.clipboard.writeText(csvData);
    let encodeUri = encodeURI(csvHead + csvData);
    let a = document.createElement('a');
    a.setAttribute('href', encodeUri);
    a.setAttribute('download', `admin-${new Date().getTime()}`);
    this.el.nativeElement.appendChild(a);
    a.click();
    this.el.nativeElement.removeChild(a);
  }


}
