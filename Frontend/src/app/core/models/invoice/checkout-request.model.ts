export interface CheckoutRequestModel {
  id?: number;
  paymentMethod: string;
  shippingData: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
}
