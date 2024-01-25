import { Component, Input, OnInit } from '@angular/core';
import { Score } from '../../models/score.model';

@Component({
  selector: 'app-score-container',
  templateUrl: './score-container.component.html',
  styleUrls: ['./score-container.component.css']
})
export class ScoreContainerComponent {

  @Input('scores') scores: Score[];

}
