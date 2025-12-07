import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ATask } from './a-task';

describe('ATask', () => {
  let component: ATask;
  let fixture: ComponentFixture<ATask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ATask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ATask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
