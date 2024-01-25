import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreContainerComponent } from './score-container.component';

describe('ScoreContainerComponent', () => {
  let component: ScoreContainerComponent;
  let fixture: ComponentFixture<ScoreContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
