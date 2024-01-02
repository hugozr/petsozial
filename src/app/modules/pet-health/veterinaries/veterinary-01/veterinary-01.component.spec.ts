import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Veterinary01Component } from './veterinary-01.component';

describe('Veterinary01Component', () => {
  let component: Veterinary01Component;
  let fixture: ComponentFixture<Veterinary01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Veterinary01Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Veterinary01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
