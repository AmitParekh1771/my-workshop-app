import { tap } from 'rxjs/operators';
import { ContentDoc, Item } from '../../shared/models/workshop.model';
import { UploadService } from '../../shared/services/upload.service';
import { Observable, Subscription } from 'rxjs';

import { PopupAlertService, PopupConfirmService } from '../../shared/components/popup-container/popup-container.component';
import { WorkshopService } from '../../shared/services/workshop.service';
import { Content, Workshop } from '../../shared/models/workshop.model';
import { Component, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CoverVideoPopupComponent } from '../../shared/components/cover-video-popup/cover-video-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Creator } from '../../shared/models/user.model';
import { Timestamp } from '../../shared/models/form-data-model';

@Component({
  selector: 'app-creator-workshop-main',
  templateUrl: './creator-workshop-main.component.html',
  styleUrls: ['./creator-workshop-main.component.css']
})
export class CreatorWorkshopMainComponent 
implements OnInit, OnDestroy {

  constructor(
    private dialog: MatDialog,
    private workshopService: WorkshopService,
    private route: ActivatedRoute,
    private popupConfirm: PopupConfirmService,
    private popupAlert: PopupAlertService,
    private router: Router,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('id') || '';

    this.workshopObj$ = this.workshopService.getWorkshopObj(this.workshopId).pipe(
      tap(workshopObj => {
        if(!workshopObj || !workshopObj[0] || !workshopObj[1]) {
          this.router.navigate(['not-found']);
          return;
        }

        this.uploadService.folderUri = workshopObj[0].folderUri;
        
        this.workshop.status = workshopObj[0].status;
        this.workshop.metaData = {...this.workshop.metaData, ...workshopObj[0].metaData};
        this.workshop.creators = workshopObj[0].creators;
        this.workshop.creatorsId = workshopObj[0].creatorsId;

        this.ratingAndStudentCount();

        this.completionStatus();
        
        this.contentDoc.content = workshopObj[1].content;

        this.contentOnLoad(workshopObj[1].content);
        
        this.strformValue = JSON.stringify({...this.workshop, ...this.contentDoc});
        
        this.form.patchValue({...workshopObj[0], ...workshopObj[1]});
        
        this.initalformValue = JSON.parse(JSON.stringify(this.form.value));
      })
    )

    this.form.valueChanges.subscribe(val => {
      this.workshop.status = val.status; 
      this.workshop.metaData = {...this.workshop.metaData, ...val.metaData}; 
      this.contentDoc.content = val.content;

      this.ratingAndStudentCount();

      this.completionStatus();
      
      this.disableButton = this.strformValue == JSON.stringify({...this.workshop, ...this.contentDoc});
      
      if(this.disableButton) window.removeEventListener('beforeunload', this.onUnload);
      else window.addEventListener('beforeunload', this.onUnload);
    });
  }

  ngOnDestroy(): void {
    if(this.disableButton) return;

    this.submit();
  }

  onUnload($event: BeforeUnloadEvent) {
    $event.preventDefault();
    return $event.returnValue = 'Save changes before you leave.';
  }
   
  workshopId = '';

  workshopObj$: Observable<[Workshop | undefined, ContentDoc | undefined]>;

  workshop = new Workshop('', '', new Creator(), '');
  contentDoc =  new ContentDoc();

  rating: number;
  
  studentCount: number;

  initalformValue: any;

  strformValue: string;

  disableButton = true;

  form = new FormGroup({
    status: new FormControl(null),
    metaData: new FormGroup({
      title: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null),
      baseRating: new FormControl(null),
      baseStudentCount: new FormControl(null),
      tag: new FormControl(null),
      landingPage: new FormControl(null),
      bgColor: new FormControl(null),
      coverImage: new FormControl(null),
      coverVideo: new FormControl(null),
      creditPoints: new FormControl(null),
      duration: new FormControl(null)
    }),
    content: new FormControl(null)
  });

  completePercentage = 0;

  totalDays = 0;

  currentDay = 0;

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

  submit() {
    Promise.all([
      this.workshopService.updateWorkshop(`workshops/${this.workshopId}`, {
        status: this.workshop.status,
        metaData: this.workshop.metaData,
        deletedAt: null
      }),
      this.workshopService.updateWorkshop(`workshops/${this.workshopId}/content/0`, { 
        content: JSON.parse(JSON.stringify(this.contentDoc.content)) 
      })
    ])
    .then(() => {
      window.removeEventListener('beforeunload', this.onUnload);
    })
    .catch(err => {
      console.log(err)
      this.popupAlert.open({
        type: 'ERROR',
        title: 'Something went wrong!',
        alertMessage: err.message
      });
    })
  }

  revert() {
    this.form.reset(JSON.parse(JSON.stringify(this.initalformValue)));
  }

  completionStatus() {    
    this.totalDays = Math.ceil((this.workshop.metaData.endDate?.seconds - this.workshop.metaData.startDate.seconds)/(24*3600));

    this.currentDay = Math.ceil((Timestamp.now().seconds - this.workshop.metaData.startDate.seconds)/(24*3600));

    if(this.currentDay < 0) this.currentDay = 0;

    this.completePercentage = (this.currentDay / this.totalDays) * 100;
    if(this.completePercentage > 100) this.completePercentage = 100;

  }

  ratingAndStudentCount() {
    this.studentCount = +this.workshop.metaData.studentCount + +this.workshop.metaData.baseStudentCount;
    
    this.rating = this.studentCount ? 
    ((+this.workshop.metaData.rating * +this.workshop.metaData.studentCount) + (+this.workshop.metaData.baseRating * +this.workshop.metaData.baseStudentCount))/(this.studentCount) : 0;

  }

  launchAgain() { 
    this.workshopService.launchAgain(this.workshopId)
    .then(docId => {
      this.popupAlert.open({
        type: 'Launch',
        title: 'Launching Again',
        alertMessage: 'This workshop will launch again with same courseId but different workshopId. You can see it in archived section. All your content will be preserved. You can edit it later.'
      });
    })
  }

  deleteWorkshop() { 
    this.popupConfirm.open({
      type: 'Delete',
      title: 'Delete Confirmation',
      highlightColor: '#b00020',
      highlightComplementColor: '#fff',
      confirmMessage: this.workshop.metaData.title,
      warningMessage: 'Are you sure! You want to delete workshop?',
      callBack: (val: boolean) => {
        if(!val) return;

        this.router.navigate(['/creator']);

        this.workshopService.deleteWorkshop(this.workshopId);
      }
    });
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
    else if(contentItem.type == 'VIDEO') {
      this.currentContent = contentItem;
    }
    else if(contentItem.type == 'EVENT') {
      window.open(contentItem.item.embedUrl, '_blank')
    }
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
