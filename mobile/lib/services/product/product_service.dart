import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:http_parser/http_parser.dart';
import '../../models/product/product_model.dart';

class ProductService {
  static const String baseUrl = 'http://192.168.1.6:5180/api/product';
  final Logger _logger = Logger(
    printer: PrettyPrinter(methodCount: 0, colors: true, printEmojis: true),
  );

  // Obtener todos los productos con filtros
  Future<List<Product>> getAllProducts({
    double? minPrice,
    double? maxPrice,
    ProductCategory? category,
    ProductSubCategory? subCategory,
    ProductStatus? status,
  }) async {
    try {
      Map<String, String> queryParams = {};
      if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
      if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
      if (category != null) queryParams['productCategory'] = category.name;
      if (subCategory != null) queryParams['productSubCategory'] = subCategory.name;
      if (status != null) queryParams['status'] = status.name;

      final uri = Uri.parse(
        '$baseUrl/',
      ).replace(queryParameters: queryParams);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> body = jsonDecode(response.body);
        final products = body.map((json) => Product.fromJson(json)).toList();
        _logger.i('✅ Productos recibidos del backend (${products.length})');
        return products;
      } else {
        _logger.w('⚠️ Error al obtener productos: ${response.statusCode}');
        throw Exception('Error loading products: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en getAllProducts', error: error);
      rethrow;
    }
  }

  // Buscar productos
  Future<List<Product>> searchProducts(String query) async {
    try {
      final uri = Uri.parse(
        '$baseUrl/search',
      ).replace(queryParameters: {'query': query});
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> body = jsonDecode(response.body);
        return body.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Error searching products: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en searchProducts', error: error);
      rethrow;
    }
  }

  // Obtener producto por ID
  Future<Product> getProductById(int id, {int? userId}) async {
    try {
      final uri = Uri.parse('$baseUrl/$id').replace(
        queryParameters: userId != null ? {'userId': userId.toString()} : null,
      );
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        return Product.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Error loading product: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en getProductById', error: error);
      rethrow;
    }
  }

  // Agregar producto
  Future<Product> addProduct(Product product, {File? image}) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/add'));

      product.toJson().forEach((key, value) {
        if (value != null) request.fields[key] = value.toString();
      });

      if (image != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'image',
            image.path,
            contentType: MediaType('image', 'jpeg'),
          ),
        );
      }

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode == 200 || response.statusCode == 201) {
        return Product.fromJson(jsonDecode(responseBody));
      } else {
        throw Exception('Error adding product: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en addProduct', error: error);
      rethrow;
    }
  }

  // Actualizar producto
  Future<Product> updateProduct(
    int id,
    Map<String, dynamic> productData, {
    File? image,
  }) async {
    try {
      var request = http.MultipartRequest('PUT', Uri.parse('$baseUrl/$id'));

      productData.forEach((key, value) {
        if (value != null) request.fields[key] = value.toString();
      });

      if (image != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'image',
            image.path,
            contentType: MediaType('image', 'jpeg'),
          ),
        );
      }

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        return Product.fromJson(jsonDecode(responseBody));
      } else {
        throw Exception('Error updating product: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en updateProduct', error: error);
      rethrow;
    }
  }

  // Eliminar producto
  Future<void> deleteProduct(int id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/$id'));

      if (response.statusCode == 200) {
        _logger.i('🗑️ Producto eliminado correctamente');
      } else {
        throw Exception('Error deleting product: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en deleteProduct', error: error);
      rethrow;
    }
  }
}
