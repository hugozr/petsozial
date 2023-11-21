import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCommunitiesComponent } from './my-communities.component';

describe('MyCommunitiesComponent', () => {
  let component: MyCommunitiesComponent;
  let fixture: ComponentFixture<MyCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCommunitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
