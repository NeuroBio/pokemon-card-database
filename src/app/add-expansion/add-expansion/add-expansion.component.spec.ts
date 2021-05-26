import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpansionComponent } from './add-expansion.component';

describe('AddExpansionComponent', () => {
  let component: AddExpansionComponent;
  let fixture: ComponentFixture<AddExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpansionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
