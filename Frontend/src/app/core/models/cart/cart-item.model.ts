import { ProductModel } from "../product/product.model";
import { CartModel } from "./cart.model";

export interface CartItemModel {
    id: number;
    cartId: number;
    cart?: CartModel;
    productId: number;
    product: ProductModel;
    quantity: number;
}
