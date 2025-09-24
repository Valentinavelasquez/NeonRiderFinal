import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visualizacion } from './visualizacion';

describe('Visualizacion', () => {
  let component: Visualizacion;
  let fixture: ComponentFixture<Visualizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visualizacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Visualizacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
