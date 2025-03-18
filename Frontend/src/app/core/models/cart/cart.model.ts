import { CartItemModel } from "./cart-item.model";
import { AuthModel } from "../auth/auth.model";

export interface CartModel {
    id: number;
    userId?: number;
    user?: AuthModel;
    items: CartItemModel[];
    createdAt: string;
}
