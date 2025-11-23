import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssets } from './assign-assets';

describe('AssignAssets', () => {
  let component: AssignAssets;
  let fixture: ComponentFixture<AssignAssets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignAssets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAssets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
