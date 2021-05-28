import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickCardComponent } from './pick-card.component';

describe('PickCardComponent', () => {
  let component: PickCardComponent;
  let fixture: ComponentFixture<PickCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
