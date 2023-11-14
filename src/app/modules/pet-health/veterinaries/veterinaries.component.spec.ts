import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariesComponent } from './veterinaries.component';

describe('VeterinariesComponent', () => {
  let component: VeterinariesComponent;
  let fixture: ComponentFixture<VeterinariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VeterinariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
