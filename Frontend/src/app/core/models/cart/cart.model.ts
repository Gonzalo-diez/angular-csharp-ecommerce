import { CartItemModel } from "./cart-item.model";
import { AuthModel } from "../auth/auth.model";

export interface CartModel {
    id: number;
    userId?: number;
    user?: AuthModel;
    sessionId?: string;
    items: CartItemModel[];
    createdAt: string;
}
