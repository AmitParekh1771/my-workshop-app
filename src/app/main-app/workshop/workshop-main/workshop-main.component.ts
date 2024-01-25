import { switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkshopService } from './../../shared/services/workshop.service';
import { Content, ContentDoc, Item, Workshop } from '../../shared/models/workshop.model';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoverVideoPopupComponent } from '../../shared/components/cover-video-popup/cover-video-popup.component';
import { Creator } from '../../shared/models/user.model';
import { Timestamp } from '../../shared/models/form-data-model';
import Utils from '../../shared/utils/utility-function';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-workshop-main',
  templateUrl: './workshop-main.component.html',
  styleUrls: ['./workshop-main.component.css']
})
export class WorkshopMainComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private workshopService: WorkshopService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('id') || '';

    this.workshopObj$ = this.workshopService.getWorkshopObj(this.workshopId).pipe(
      tap(workshopObj => {
        if(!workshopObj || !workshopObj[0]) {
          this.router.navigate(['not-found']);
          return;
        }

        this.workshop.status = workshopObj[0].status;
        this.workshop.metaData = {...this.workshop.metaData, ...workshopObj[0].metaData};
        this.workshop.creators = workshopObj[0].creators;
        this.workshop.creatorsId = workshopObj[0].creatorsId;
        
        this.studentCount = +this.workshop.metaData.studentCount + +this.workshop.metaData.baseStudentCount;
        
        this.rating = this.studentCount ? 
        ((+this.workshop.metaData.rating * +this.workshop.metaData.studentCount) + (+this.workshop.metaData.baseRating * +this.workshop.metaData.baseStudentCount))/(this.studentCount) : 0;

        this.totalDays = Math.ceil((this.workshop.metaData.endDate?.seconds - this.workshop.metaData.startDate.seconds)/(24*3600));

        this.currentDay = Math.ceil((Timestamp.now().seconds - this.workshop.metaData.startDate.seconds)/(24*3600));
        
        if(this.currentDay < 0) this.currentDay = 0;

        this.completePercentage = (this.currentDay / this.totalDays) * 100;
        if(this.completePercentage > 100) this.completePercentage = 100;

        this.timeLeft = Utils.timeLeft(new Date(), this.workshop.metaData.startDate.toDate())!;

        const timeInterval = setInterval(() => {
          const timeRemaining = Utils.timeLeft(new Date(), this.workshop.metaData.startDate.toDate());
          if(!timeRemaining)
            clearInterval(timeInterval);
          else
            this.timeLeft = timeRemaining;
        }, 1000);

        
        if(!workshopObj[1]) {
          console.log('course not enrolled');
          return;
        }

        this.contentDoc.content = workshopObj[1].content;

        this.contentOnLoad(workshopObj[1].content);
        
      })
    )
                    
  }

  workshopObj$: Observable<[Workshop | undefined, ContentDoc | undefined]>;

  workshop = new Workshop('', '', new Creator(), '');
  contentDoc =  new ContentDoc();

  workshopId: string;
  
  rating: number;
  
  studentCount: number;

  completePercentage = 0;

  totalDays = 0;

  currentDay = 0;

  timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  _currentContent: Content;

  get currentContent() {
    return this._currentContent;
  }

  set currentContent(contentItem: Content) {
    if(contentItem.item.embedUrl &&
      !contentItem.status.isLocked && 
      contentItem.type == 'VIDEO') {
      this._currentContent = contentItem;
    }
  }

  async enrollNow() {
    const currentUser = await this.afAuth.currentUser;
    if(!currentUser) return;

    console.log("Enrolling user...");
    await this.workshopService.addToWids(`users/${currentUser.uid}`, this.workshopId);
    await this.router.navigate(["/workshop"]);
    console.log("User enrollment successfull!");
  }

  onContentClick(contentItem: Content) {
    if(contentItem.type == 'ATTACHMENT') {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        const a = document.createElement('a');
        a.setAttribute('download', contentItem.item.title);
        a.setAttribute('href', URL.createObjectURL(blob));
        a.click();
        a.remove();
      };
      xhr.open('GET', contentItem.item.embedUrl);
      xhr.send();
    }
    else if(contentItem.type == 'VIDEO')
      this.currentContent = contentItem;
  }

  contentOnLoad(content: Content[]) {
    if(!content) return;
    for(let block of content) {
      if(block.status.isLocked) continue;
      for(let contentItem of block.content!) {
        if(contentItem.item.embedUrl &&
          !contentItem.status.isLocked && 
          contentItem.type == 'VIDEO') {
          this.currentContent = contentItem;
          return;
        }
      }
    }
  }

  openDialog(coverVideo: Item | null) {
    this.dialog.open(CoverVideoPopupComponent, {
      width: '90%',
      maxWidth: '864px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'dialog-backdrop',
      data: coverVideo
    });
  }

}
