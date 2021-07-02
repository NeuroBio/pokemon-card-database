import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionHomeComponent } from './expansion-home.component';

describe('ExpansionHomeComponent', () => {
  let component: ExpansionHomeComponent;
  let fixture: ComponentFixture<ExpansionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpansionHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
