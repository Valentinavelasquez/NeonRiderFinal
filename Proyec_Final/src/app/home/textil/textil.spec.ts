import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Textil } from './textil';

describe('Textil', () => {
  let component: Textil;
  let fixture: ComponentFixture<Textil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Textil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
