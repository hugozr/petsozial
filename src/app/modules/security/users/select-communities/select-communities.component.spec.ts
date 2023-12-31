import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommunitiesComponent } from './select-communities.component';

describe('SelectCommunitiesComponent', () => {
  let component: SelectCommunitiesComponent;
  let fixture: ComponentFixture<SelectCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCommunitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
