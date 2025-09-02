import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosIntegrales } from './cascos-integrales';

describe('CascosIntegrales', () => {
  let component: CascosIntegrales;
  let fixture: ComponentFixture<CascosIntegrales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascosIntegrales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascosIntegrales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
