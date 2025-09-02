import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosModulares } from './cascos-modulares';

describe('CascosModulares', () => {
  let component: CascosModulares;
  let fixture: ComponentFixture<CascosModulares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascosModulares]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascosModulares);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
