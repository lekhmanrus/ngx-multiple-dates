import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultipleDatesComponent } from './multiple-dates.component';

describe('MultipleDatesComponent', () => {
  let component: MultipleDatesComponent;
  let fixture: ComponentFixture<MultipleDatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<MultipleDatesComponent>(MultipleDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
