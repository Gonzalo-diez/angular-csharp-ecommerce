import 'package:mobile/models/product/product_model.dart';

class UserDto {
  final int? id;
  final String name;
  final String email;

  UserDto({this.id, required this.name, required this.email});

  factory UserDto.fromJson(Map<String, dynamic> json) =>
      UserDto(id: json['id'], name: json['name'], email: json['email']);
}

class ProductDto {
  final int? id;
  final String name;
  final ProductCategory category;
  final double price;

  ProductDto({
    this.id,
    required this.name,
    required this.category,
    required this.price,
  });

  factory ProductDto.fromJson(Map<String, dynamic> json) => ProductDto(
    id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()),
    name: json['name'],
    category: ProductCategoryExtension.fromString(json['category']),
    price: (json['price'] as num).toDouble(),
  );
}

class CategoryProductCount {
  final ProductCategory category;
  final int totalProducts;

  CategoryProductCount({required this.category, required this.totalProducts});

  factory CategoryProductCount.fromJson(Map<String, dynamic> json) =>
      CategoryProductCount(
        category: ProductCategoryExtension.fromString(json['category']),
        totalProducts: json['totalProducts'],
      );
}

class CategorySalesDto {
  final ProductCategory category;
  final int totalSold;
  final double percentageSold;

  CategorySalesDto({
    required this.category,
    required this.totalSold,
    required this.percentageSold,
  });

  factory CategorySalesDto.fromJson(Map<String, dynamic> json) =>
      CategorySalesDto(
        category: ProductCategoryExtension.fromString(json['category']),
        totalSold: json['totalSold'],
        percentageSold: (json['percentageSold'] as num).toDouble(),
      );
}

class SubcategorySalesDto {
  final ProductCategory category;
  final ProductSubCategory subCategory;
  final int totalSold;
  final double percentageSold;

  SubcategorySalesDto({
    required this.category,
    required this.subCategory,
    required this.totalSold,
    required this.percentageSold,
  });

  factory SubcategorySalesDto.fromJson(Map<String, dynamic> json) =>
      SubcategorySalesDto(
        category: ProductCategoryExtension.fromString(json['category']),
        subCategory: ProductSubCategoryExtension.fromString(
          json['subCategory'],
        ),
        totalSold: json['totalSold'],
        percentageSold: (json['percentageSold'] as num).toDouble(),
      );
}

class DashboardModel {
  final int totalUsers;
  final List<UserDto> users;
  final int totalPurchases;
  final List<ProductDto> products;
  final int totalProducts;
  final double totalRevenue;
  final List<CategoryProductCount> productsByCategory;
  final List<CategorySalesDto> categorySales;
  final List<SubcategorySalesDto> subcategorySales;

  DashboardModel({
    required this.totalUsers,
    required this.users,
    required this.totalPurchases,
    required this.products,
    required this.totalProducts,
    required this.totalRevenue,
    required this.productsByCategory,
    required this.categorySales,
    required this.subcategorySales,
  });

  factory DashboardModel.fromJson(Map<String, dynamic> json) => DashboardModel(
    totalUsers: json['totalUsers'],
    users: (json['users'] as List).map((u) => UserDto.fromJson(u)).toList(),
    totalPurchases: json['totalPurchases'],
    products:
        (json['products'] as List).map((p) => ProductDto.fromJson(p)).toList(),
    totalProducts: json['totalProducts'],
    totalRevenue: (json['totalRevenue'] as num).toDouble(),
    productsByCategory:
        (json['productsByCategory'] as List)
            .map((c) => CategoryProductCount.fromJson(c))
            .toList(),
    categorySales:
        (json['categorySales'] as List)
            .map((s) => CategorySalesDto.fromJson(s))
            .toList(),
    subcategorySales:
        (json['subcategorySales'] as List)
            .map((s) => SubcategorySalesDto.fromJson(s))
            .toList(),
  );
}
