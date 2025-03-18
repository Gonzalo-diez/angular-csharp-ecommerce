import { ProductModel } from "../product/product.model";
import { AuthModel } from "../auth/auth.model";

export interface BrowsingHistoryModel {
    id: number;
    userId?: number;
    user?: AuthModel;
    productId: number;
    product: ProductModel;
    dateTime: string;
}
