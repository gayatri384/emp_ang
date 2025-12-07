import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETask } from './e-task';

describe('ETask', () => {
  let component: ETask;
  let fixture: ComponentFixture<ETask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ETask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ETask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
