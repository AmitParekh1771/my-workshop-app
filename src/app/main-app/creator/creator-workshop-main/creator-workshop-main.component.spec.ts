import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorWorkshopMainComponent } from './creator-workshop-main.component';

describe('CreatorWorkshopMainComponent', () => {
  let component: CreatorWorkshopMainComponent;
  let fixture: ComponentFixture<CreatorWorkshopMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorWorkshopMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorWorkshopMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
