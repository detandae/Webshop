import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditorListComponent } from './product-editor-list.component';

describe('ProductEditorListComponent', () => {
  let component: ProductEditorListComponent;
  let fixture: ComponentFixture<ProductEditorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
