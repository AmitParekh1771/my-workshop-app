import { Component, Input } from '@angular/core';
import { Workshop } from '../../models/workshop.model';
import Utils from '../../utils/utility-function';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.css']
})
export class WorkshopCardComponent {

  constructor() { 
    this.setTimer();
  }

  @Input('routerLink') routerLink: string[];

  deadlineMessage: string = '...';

  @Input('cardType') cardType = "CREATOR";

  @Input('workshop') workshop: Workshop & {id: string};

  get rating() {
    let r1 = +this.workshop.metaData.rating || 0;
    let r2 = +this.workshop.metaData.baseRating || 0;

    let s1 = +this.workshop.metaData.studentCount || 0;
    let s2 = +this.workshop.metaData.baseStudentCount || 0;

    if(s1+s2 == 0) return 0;

    return ((r1*s1 + r2*s2) / (s1+s2));
  }

  get studentCount() {
    return (+this.workshop.metaData.studentCount + +this.workshop.metaData.baseStudentCount) || 0;
  }

  get showDeadline() {
    if(!this.workshop.metaData.startDate) return false;
    
    return this.cardType != 'COMPLETED' && (this.workshop.metaData.startDate.seconds * 1000) > new Date().getTime();
  }

  get cardAction() {
    if(this.cardType == 'ENROLLED')
      return { class: 'purple-svg', text: 'Continue Learning',  svg: '' };
    else if(this.cardType == 'COMPLETED')
      return { class: 'green-svg', text: 'Completed',  svg: '' };
    else if(this.cardType == 'UPCOMING')
      return { class: 'black-svg', text: 'Enroll Now',  svg: '' };
    else if(this.cardType == 'CREATOR')
      return { class: 'black-svg', text: 'Edit',  svg: '' };
    return { class: 'black-svg', text: 'Loading',  svg: '' };
  }

  setTimer() {
    let deadLine = setInterval(() => {
      if(!this.workshop || !this.workshop.metaData.startDate) {
        clearInterval(deadLine);
        return;
      }

      let timeLeft = Utils.timeLeft(new Date(), new Date(this.workshop.metaData.startDate.seconds * 1000));

      if(!timeLeft)
        clearInterval(deadLine);
      else {
        let formattedTime = timeLeft.days ? 
        `${Utils.pad(timeLeft.days, 2)} Day${timeLeft.days == 1 ? '' : 's'}`:
        `${Utils.pad(timeLeft.hours, 2)}:${Utils.pad(timeLeft.minutes, 2)}:${Utils.pad(timeLeft.seconds, 2)}`;
  
        if(this.cardType == 'ENROLLED')
          this.deadlineMessage = `Starts in ${formattedTime}`;
        else
          this.deadlineMessage = `Registration ends in ${formattedTime}`;
      }
      
    }, 1000);
  }

}
