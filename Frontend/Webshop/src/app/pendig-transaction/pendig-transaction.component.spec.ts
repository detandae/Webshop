import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendigTransactionComponent } from './pendig-transaction.component';

describe('PendigTransactionComponent', () => {
  let component: PendigTransactionComponent;
  let fixture: ComponentFixture<PendigTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendigTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendigTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
