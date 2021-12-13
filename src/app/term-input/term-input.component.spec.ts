import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermInputComponent } from './term-input.component';

describe('MintermInputComponent', () => {
  let component: TermInputComponent;
  let fixture: ComponentFixture<TermInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
