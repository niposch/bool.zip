import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintermInputComponent } from './minterm-input.component';

describe('MintermInputComponent', () => {
  let component: MintermInputComponent;
  let fixture: ComponentFixture<MintermInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintermInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintermInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
