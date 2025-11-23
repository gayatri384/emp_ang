import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAssets } from './emp-assets';

describe('EmpAssets', () => {
  let component: EmpAssets;
  let fixture: ComponentFixture<EmpAssets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAssets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAssets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
