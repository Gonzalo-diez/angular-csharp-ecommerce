import { AuthModel } from "../auth/auth.model";
import { InvoiceDetailModel } from "./invoice-detail.model";
import { CheckoutRequestModel } from "./checkout-request.model";

export interface InvoiceModel {
    id: number; 
    userId?: number;
    user?: AuthModel;
    checkoutRequest: CheckoutRequestModel;
    transactionId: string;
    total: number;
    date: string;
    details: InvoiceDetailModel[]
}
