import { AuthModel } from '../auth/auth.model';
import { ProductModel } from '../product/product.model';

export interface PurchaseModel {
  id: number;
  userId?: number;
  user?: AuthModel; 
  productId: number;
  product: ProductModel; 
  quantity: number;
  purchaseDate: string;
}
