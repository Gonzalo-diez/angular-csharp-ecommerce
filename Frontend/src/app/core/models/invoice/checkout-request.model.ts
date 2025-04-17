export interface CheckoutRequestModel {
  id?: number;
  paymentMethod: string;
  shippingData: {
    cardNumber: string;
    securityCode: string;
    expirationDate: Date;
    fullName: string;
    city: string;
    address: string;
    zipCode: string;
    phone: string;
  };
}
