import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopTableComponent } from './workshop-table.component';

describe('WorkshopTableComponent', () => {
  let component: WorkshopTableComponent;
  let fixture: ComponentFixture<WorkshopTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
