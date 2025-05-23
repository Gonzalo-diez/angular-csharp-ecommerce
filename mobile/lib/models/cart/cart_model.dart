import 'package:mobile/models/cart/cart_item_model.dart';
import 'package:mobile/models/auth/auth_model.dart';

class CartModel {
  final int id;
  final int? userId;
  final AuthModel? user;
  final List<CartItemModel> items;
  final DateTime createdAt;

  CartModel({
    required this.id,
    this.userId,
    this.user,
    required this.items,
    required this.createdAt,
  });

  factory CartModel.fromJson(Map<String, dynamic> json) => CartModel(
    id: json['id'] ?? 0,
    userId: json['userId'],
    user: json['user'] != null ? AuthModel.fromJson(json['user']) : null,
    items:
        (json['items'] as List?)
            ?.where((item) => item['productId'] != null)
            .map((item) => CartItemModel.fromJson(item))
            .toList() ??
        [],
    createdAt: DateTime.parse(json['createdAt']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'user': user?.toJson(),
    'items': items.map((item) => item.toJson()).toList(),
    'createdAt': createdAt.toIso8601String(),
  };
}
