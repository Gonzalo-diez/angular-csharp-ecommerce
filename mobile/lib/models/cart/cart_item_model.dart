import 'package:mobile/models/product/product_model.dart';
import 'package:mobile/models/cart/cart_model.dart';

class CartItemModel {
  final int id;
  final int cartId;
  final CartModel? cart;
  final int? productId;
  final ProductModel product;
  final int? quantity;

  CartItemModel({
    required this.id,
    required this.cartId,
    this.cart,
    required this.productId,
    required this.product,
    required this.quantity,
  });

  factory CartItemModel.fromJson(Map<String, dynamic> json) => CartItemModel(
    id: json['id'],
    cartId: json['cartId'],
    cart: json['cart'] != null ? CartModel.fromJson(json['cart']) : null,
    productId: json['productId'],
    product: json['product'] != null
    ? ProductModel.fromJson(json['product'])
    : ProductModel.empty(),
    quantity: json['quantity'],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'cartId': cartId,
    'cart': cart?.toJson(),
    'productId': productId,
    'product': product.toJson(),
    'quantity': quantity,
  };
}
