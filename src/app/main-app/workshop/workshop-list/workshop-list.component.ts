import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop } from '../../shared/models/workshop.model';
import { WorkshopService } from '../../shared/services/workshop.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.css']
})
export class WorkshopListComponent {

  constructor(private workshopService: WorkshopService) { }

  enrolledWorkshops$: Observable<(Workshop & {id: string})[]>  = this.workshopService.enrolledWorkshops().pipe(map(workshops => workshops.slice(0, 5)));

  completedWorkshops$: Observable<(Workshop & {id: string})[]>  = this.workshopService.recentCompletedWorkshops().pipe(map(workshops => workshops.slice(0, 5)));

  upcomingWorkshops$: Observable<(Workshop & {id: string})[]>  = this.workshopService.upcomingWorkshops().pipe(map(workshops => workshops.slice(0, 5)));

}

@Component({
  selector: 'app-workshop-list-status-wise',
  templateUrl: './workshop-list-status-wise.component.html',
  styleUrls: ['./workshop-list.component.css']
})
export class WorkshopListStatusWiseComponent implements OnInit {

  constructor(
    private workshopService: WorkshopService,
    private route: ActivatedRoute  
  ) { }

  ngOnInit(): void {
    this.param = this.route.snapshot.paramMap.get('status') || '';

    switch(this.param) {
      case 'enrolled': {
        this.workshops$ = this.workshopService.enrolledWorkshops();
        break;
      }
      case 'completed': {
        this.workshops$ = this.workshopService.recentCompletedWorkshops();
        break;
      } 
      case 'upcoming': {
        this.workshops$ = this.workshopService.upcomingWorkshops();
        break;
      } 
    }
    
  }

  param: string = '';

  workshops$: Observable<(Workshop & {id: string})[]>;
}