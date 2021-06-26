import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCompletionComponent } from './set-completion.component';

describe('SetCompletionComponent', () => {
  let component: SetCompletionComponent;
  let fixture: ComponentFixture<SetCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
