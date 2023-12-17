import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanCardComponent } from './human-card.component';

describe('HumanCardComponent', () => {
  let component: HumanCardComponent;
  let fixture: ComponentFixture<HumanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HumanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
