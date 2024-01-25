import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorTableComponent } from './creator-table.component';

describe('CreatorTableComponent', () => {
  let component: CreatorTableComponent;
  let fixture: ComponentFixture<CreatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
