import { ProductCategory } from './product-category';
import { ProductSubCategory } from './product-sub-category';
import { ProductStatus } from './product-status';
import { AuthModel } from '../auth/auth.model';
import { PurchaseModel } from '../purchase/purchase.model';

export interface ProductModel {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  status: ProductStatus;
  ownerId?: number;
  owner?: AuthModel;
  purchases?: PurchaseModel[]; 
  imageUrl: string;
}