import { ProductModel } from "../product/product.model";
import { InvoiceModel } from "./invoice.model";

export interface InvoiceDetailModel {
    id: number;
    invoiceId: number;
    invoice?: InvoiceModel;
    productId: number;
    product: ProductModel;
    quantity: number;
    unitPrice: number;
}
