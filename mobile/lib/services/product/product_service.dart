import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import '../../models/product/product_model.dart';

class ProductService {
  static const String baseUrl = 'http://192.168.1.6:5180/api/product';
  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      colors: true,
      printEmojis: true,
    ),
  );

  Future<List<Product>> getAllProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/'));

      if (response.statusCode == 200) {
        final List<dynamic> body = jsonDecode(response.body);
        final List<Product> products =
            body.map((json) => Product.fromJson(json)).toList();

        _logger.i('✅ Productos recibidos del backend:');
        for (var product in products) {
          _logger.d(product); // gracias al .toString()
        }

        return products;
      } else {
        _logger.w('⚠️ Error al obtener productos: ${response.statusCode}');
        throw Exception('Error to load products: ${response.statusCode}');
      }
    } catch (error) {
      _logger.e('❌ Error en ProductService.getAllProducts', error: error);
      throw Exception('Error in server: $error');
    }
  }
}
