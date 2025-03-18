import { AuthModel } from '../auth/auth.model';
import { ProductModel } from '../product/product.model';

export interface PurchaseModel {
  id: number;
  userId?: number;  // Opcional porque puede ser null en el backend
  user?: AuthModel;      // Usuario que compró (puede ser null)
  productId: number; // ID del producto comprado
  product: ProductModel;  // Información del producto comprado
  quantity: number;  // Cantidad comprada
  purchaseDate: string; // Fecha de compra (se almacena como string en JSON)
}
