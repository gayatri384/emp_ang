import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpLeave } from './emp-leave';

describe('EmpLeave', () => {
  let component: EmpLeave;
  let fixture: ComponentFixture<EmpLeave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpLeave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpLeave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
