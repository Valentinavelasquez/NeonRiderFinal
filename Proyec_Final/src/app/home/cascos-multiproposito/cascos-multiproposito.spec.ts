import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosMultiproposito } from './cascos-multiproposito';

describe('CascosMultiproposito', () => {
  let component: CascosMultiproposito;
  let fixture: ComponentFixture<CascosMultiproposito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascosMultiproposito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascosMultiproposito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
