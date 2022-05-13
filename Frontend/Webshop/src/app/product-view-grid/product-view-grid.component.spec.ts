import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductViewGridComponent } from './product-view-grid.component';

describe('ProductViewGridComponent', () => {
  let component: ProductViewGridComponent;
  let fixture: ComponentFixture<ProductViewGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductViewGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductViewGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
