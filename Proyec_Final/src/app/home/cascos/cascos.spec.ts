import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cascos } from './cascos';

describe('Cascos', () => {
  let component: Cascos;
  let fixture: ComponentFixture<Cascos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cascos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cascos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
