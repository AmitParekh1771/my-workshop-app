import { Workshop } from './../../shared/models/workshop.model';
import { map } from 'rxjs/operators';
import { SpinnerService } from './../../shared/services/spinner.service';

import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from './../../shared/services/workshop.service';
import { Component, OnInit } from '@angular/core';
import { Score } from '../../shared/models/score.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creator-workshop-list',
  templateUrl: './creator-workshop-list.component.html',
  styleUrls: ['./creator-workshop-list.component.css']
})
export class CreatorWorkshopListComponent {

  constructor(
    public workshopService: WorkshopService,
    private router: Router,
    private spinnerService: SpinnerService
  ) { }

  createWorkshop() {
    this.spinnerService.startSpinner();
    this.workshopService.createWorkshop()
      .then(docRef => {
        if(docRef)
          this.router.navigate(['creator', docRef.id, docRef.title]);
        this.spinnerService.stopSpinner();
      })
  }

  activeWorkshops$: Observable<(Workshop & {id: string})[]>  = this.workshopService.creatorWorkshopsStatusWise({id: 1, name: 'ACTIVE'}).pipe(map(workshops => workshops.slice(0, 5)));

  archivedWorkshops$: Observable<(Workshop & {id: string})[]>  = this.workshopService.creatorWorkshopsStatusWise({id: 2, name: 'ARCHIVED'}).pipe(map(workshops => workshops.slice(0, 4)));

  completedWorkshops$: Observable<(Workshop & {id: string})[]>  = this.workshopService.creatorWorkshopsStatusWise({id: 3, name: 'COMPLETED'}).pipe(map(workshops => workshops.slice(0, 5)));

}

@Component({
  selector: 'app-creator-workshop-list-status-wise',
  templateUrl: './creator-workshop-list-status-wise.component.html',
  styleUrls: ['./creator-workshop-list.component.css']
})
export class CreatorWorkshopListStatusWiseComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private workshopService: WorkshopService
  ) { }

  ngOnInit(): void {
    this.param = this.route.snapshot.paramMap.get('status') || '';

    switch(this.param) {
      case 'active': {
        this.workshops$ = this.workshopService.creatorWorkshopsStatusWise({id: 1, name: 'ACTIVE'});
        break;
      }
      case 'archived': {
        this.workshops$ = this.workshopService.creatorWorkshopsStatusWise({id: 2, name: 'ARCHIVED'});
        break;
      } 
      case 'completed': {
        this.workshops$ = this.workshopService.creatorWorkshopsStatusWise({id: 3, name: 'COMPLETED'});
        break;
      } 
    }

  }

  param: string = '';

  workshops$: Observable<(Workshop & {id: string})[]>;
}
