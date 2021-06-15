import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinderViewComponent } from './binder-view.component';

describe('BinderViewComponent', () => {
  let component: BinderViewComponent;
  let fixture: ComponentFixture<BinderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinderViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
