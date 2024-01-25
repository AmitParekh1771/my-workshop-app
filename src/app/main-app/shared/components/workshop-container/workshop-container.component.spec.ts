import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopContainerComponent } from './workshop-container.component';

describe('WorkshopContainerComponent', () => {
  let component: WorkshopContainerComponent;
  let fixture: ComponentFixture<WorkshopContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
