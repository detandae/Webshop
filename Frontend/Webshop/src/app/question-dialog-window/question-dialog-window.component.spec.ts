import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDialogWindowComponent } from './question-dialog-window.component';

describe('QuestionDialogWindowComponent', () => {
  let component: QuestionDialogWindowComponent;
  let fixture: ComponentFixture<QuestionDialogWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionDialogWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDialogWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
