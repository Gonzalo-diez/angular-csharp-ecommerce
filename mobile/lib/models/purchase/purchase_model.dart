import '../auth/auth_model.dart';
import '../product/product_model.dart';

class PurchaseModel {
  final int id;
  final int? userId;
  final AuthModel? user;
  final int productId;
  final ProductModel product;
  final int quantity;
  final String purchaseDate;

  PurchaseModel({
    required this.id,
    this.userId,
    this.user,
    required this.productId,
    required this.product,
    required this.quantity,
    required this.purchaseDate,
  });

  factory PurchaseModel.fromJson(Map<String, dynamic> json) {
    return PurchaseModel(
      id: json['id'],
      userId: json['userId'],
      user: json['user'] != null ? AuthModel.fromJson(json['user']) : null,
      productId: json['productId'],
      product: ProductModel.fromJson(json['product']),
      quantity: json['quantity'],
      purchaseDate: json['purchaseDate'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      if (userId != null) 'userId': userId,
      if (user != null) 'user': user!.toJson(),
      'productId': productId,
      'product': product.toJson(),
      'quantity': quantity,
      'purchaseDate': purchaseDate,
    };
  }
}
