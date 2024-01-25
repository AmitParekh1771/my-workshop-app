import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopMainComponent } from './workshop-main.component';

describe('WorkshopMainComponent', () => {
  let component: WorkshopMainComponent;
  let fixture: ComponentFixture<WorkshopMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
