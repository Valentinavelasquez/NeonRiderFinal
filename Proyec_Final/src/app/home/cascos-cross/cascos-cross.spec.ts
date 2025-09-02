import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosCross } from './cascos-cross';

describe('CascosCross', () => {
  let component: CascosCross;
  let fixture: ComponentFixture<CascosCross>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascosCross]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascosCross);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
