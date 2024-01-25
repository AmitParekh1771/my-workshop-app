import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorWorkshopListComponent } from './creator-workshop-list.component';

describe('CreatorWorkshopListComponent', () => {
  let component: CreatorWorkshopListComponent;
  let fixture: ComponentFixture<CreatorWorkshopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorWorkshopListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorWorkshopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
