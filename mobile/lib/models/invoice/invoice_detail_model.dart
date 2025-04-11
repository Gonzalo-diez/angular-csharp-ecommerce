import '../product/product_model.dart'; // Asegurate de tener definido ProductModel
// import 'invoice_model.dart'; // Opcional, si necesitas el objeto completo

class InvoiceDetailModel {
  final int id;
  final int invoiceId;
  // final InvoiceModel? invoice; // Omitido para evitar recursión
  final int productId;
  final ProductModel product;
  final int quantity;
  final double unitPrice;

  InvoiceDetailModel({
    required this.id,
    required this.invoiceId,
    required this.productId,
    required this.product,
    required this.quantity,
    required this.unitPrice,
  });

  factory InvoiceDetailModel.fromJson(Map<String, dynamic> json) {
    return InvoiceDetailModel(
      id: json['id'],
      invoiceId: json['invoiceId'],
      productId: json['productId'],
      product: ProductModel.fromJson(json['product']),
      quantity: json['quantity'],
      unitPrice: (json['unitPrice'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'invoiceId': invoiceId,
      'productId': productId,
      'product': product.toJson(),
      'quantity': quantity,
      'unitPrice': unitPrice,
    };
  }
}
