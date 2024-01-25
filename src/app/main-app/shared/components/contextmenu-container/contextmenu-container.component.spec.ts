import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextmenuContainerComponent } from './contextmenu-container';

describe('ContextmenuContainerComponent', () => {
  let component: ContextmenuContainerComponent;
  let fixture: ComponentFixture<ContextmenuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextmenuContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextmenuContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
