import 'package:mobile/models/auth/auth_model.dart';

enum ProductCategory { technology, clothing, home }

extension ProductCategoryExtension on ProductCategory {
  static ProductCategory fromString(String value) {
    return ProductCategory.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => ProductCategory.technology, // Valor por defecto
    );
  }
}

enum ProductSubCategory {
  pc,
  console,
  smartphone,
  men,
  women,
  kids,
  furniture,
  kitchen,
  decor,
}

extension ProductSubCategoryExtension on ProductSubCategory {
  static ProductSubCategory fromString(String value) {
    return ProductSubCategory.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => ProductSubCategory.pc,
    );
  }
}

enum ProductStatus { enable, outOfStock, disable }

extension ProductStatusExtension on ProductStatus {
  static ProductStatus fromString(String value) {
    return ProductStatus.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => ProductStatus.enable,
    );
  }
}

class ProductModel {
  final int id;
  final String name;
  final String brand;
  final double price;
  final int stock;
  final ProductCategory category;
  final ProductSubCategory subCategory;
  final ProductStatus status;
  final int? ownerId;
  final AuthModel? owner;
  final String? imageUrl;

  @override
  String toString() {
    return '📦 Producto(id: $id, name: $name, brand: $brand, price: \$${price.toStringAsFixed(2)}, stock: $stock, category: $category, subCategory: $subCategory, status: $status, imageUrl: $imageUrl)';
  }

  ProductModel({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.stock,
    required this.category,
    required this.subCategory,
    required this.status,
    this.ownerId,
    this.owner,
    this.imageUrl,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      name: json['name'].toString(),
      brand: json['brand'].toString(),
      price: (json['price'] as num).toDouble(),
      stock:
          json['stock'] is int
              ? json['stock']
              : int.parse(json['stock'].toString()),
      category: ProductCategoryExtension.fromString(json['category'].toString()),
      subCategory: ProductSubCategoryExtension.fromString(json['subCategory'].toString()),
      status: ProductStatusExtension.fromString(json['status'].toString()),
      ownerId: json['ownerId'] != null ? int.parse(json['ownerId'].toString()) : null,
      owner: json['owner'] != null ? AuthModel.fromJson(json['owner']) : null,
      imageUrl: json['imageUrl']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'brand': brand,
      'price': price,
      'stock': stock,
      'category': category.index,
      'subCategory': subCategory.index,
      'status': status.index,
      'ownerId': ownerId,
      'owner': owner?.toJson(),
      'imageUrl': imageUrl,
    };
  }
}
