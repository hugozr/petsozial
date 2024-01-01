import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetShopsComponent } from './pet-shops.component';

describe('PetShopsComponent', () => {
  let component: PetShopsComponent;
  let fixture: ComponentFixture<PetShopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetShopsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetShopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
