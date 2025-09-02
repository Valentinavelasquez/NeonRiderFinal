import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosAbatibles } from './cascos-abatibles';

describe('CascosAbatibles', () => {
  let component: CascosAbatibles;
  let fixture: ComponentFixture<CascosAbatibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascosAbatibles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascosAbatibles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
