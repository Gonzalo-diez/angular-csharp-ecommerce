import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSubcategoryComponent } from './product-subcategory.component';

describe('ProductSubcategoryComponent', () => {
  let component: ProductSubcategoryComponent;
  let fixture: ComponentFixture<ProductSubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSubcategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
