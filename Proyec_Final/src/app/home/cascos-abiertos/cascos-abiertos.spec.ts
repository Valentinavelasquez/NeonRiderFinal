import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosAbiertos } from './cascos-abiertos';

describe('CascosAbiertos', () => {
  let component: CascosAbiertos;
  let fixture: ComponentFixture<CascosAbiertos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascosAbiertos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascosAbiertos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
