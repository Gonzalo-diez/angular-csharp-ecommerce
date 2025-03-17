import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSharedComponent } from './product-shared.component';

describe('ProductSharedComponent', () => {
  let component: ProductSharedComponent;
  let fixture: ComponentFixture<ProductSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSharedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
