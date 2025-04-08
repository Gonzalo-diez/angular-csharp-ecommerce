enum ProductCategory { technology, clothing, home }

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

enum ProductStatus { enable, outOfStock, disable }

class Product {
  final int id;
  final String name;
  final String brand;
  final double price;
  final int stock;
  final ProductCategory category;
  final ProductSubCategory subCategory;
  final ProductStatus status;
  final int? ownerId;
  final String? imageUrl;

  @override
  String toString() {
    return '📦 Producto(id: $id, name: $name, brand: $brand, price: \$${price.toStringAsFixed(2)}, stock: $stock, category: $category, subCategory: $subCategory, status: $status, imageUrl: $imageUrl)';
  }

  Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.stock,
    required this.category,
    required this.subCategory,
    required this.status,
    this.ownerId,
    this.imageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      name: json['name'].toString(),
      brand: json['brand'].toString(),
      price: (json['price'] as num).toDouble(),
      stock:
          json['stock'] is int
              ? json['stock']
              : int.parse(json['stock'].toString()),
      category: ProductCategory.values[json['category']],
      subCategory: ProductSubCategory.values[json['subCategory']],
      status: ProductStatus.values[json['status']],
      ownerId: json['ownerId'],
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
      'imageUrl': imageUrl,
    };
  }
}
