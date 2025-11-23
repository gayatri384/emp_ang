import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendance } from './emp-attendance';

describe('EmpAttendance', () => {
  let component: EmpAttendance;
  let fixture: ComponentFixture<EmpAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAttendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
