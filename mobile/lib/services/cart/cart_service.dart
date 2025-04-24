import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/models/cart/cart_model.dart';
import 'package:mobile/models/invoice/invoice_model.dart';
import 'package:mobile/models/purchase/purchase_model.dart';
import 'package:mobile/models/invoice/checkout_request_model.dart';

class CartService {
  final String baseUrl = 'http://192.168.1.6:5180/api/cart';
  final logger = Logger();

  Future<Map<String, String>> _getAuthHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) throw Exception('No se encontró el token');
    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }

  Future<CartModel> getCart() async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId')?.toString();
    final uri = Uri.parse('$baseUrl?userId=$userId');
    final response = await http.get(uri, headers: headers);
    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  Future<bool> addProductToCart(int productId, int quantity) async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId')?.toString();
    final uri = Uri.parse('$baseUrl/add?userId=$userId');

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'productId': productId, 'quantity': quantity}),
    );

    logger.i('✅ Respuesta recibida');
    logger.d('🔢 Status code: ${response.statusCode}');
    logger.d('📦 Body: ${response.body}');

    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  Future<CartModel> removeFromCart(int productId) async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId')?.toString();

    if (userId == null) {
      throw Exception('No user ID found in SharedPreferences');
    }

    final uri = Uri.parse('$baseUrl/remove/$productId?userId=$userId');
    final response = await http.delete(uri, headers: headers);

    logger.i('✅ Respuesta recibida');
    logger.d('🔢 Status code: ${response.statusCode}');
    logger.d('📦 Body: ${response.body}');

    if (response.statusCode == 200) {
      return _handleResponse<CartModel>(
        response,
        (json) => CartModel.fromJson(json['updatedCart']),
      );
    } else {
      throw Exception(
        'Failed to remove product. Status code: ${response.statusCode}',
      );
    }
  }

  Future<CartModel> clearCart() async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId')?.toString();

    if (userId == null) {
      throw Exception('No user ID found in SharedPreferences');
    }

    final uri = Uri.parse('$baseUrl/clear?userId=$userId');
    final response = await http.delete(uri, headers: headers);

    logger.i('✅ Respuesta recibida');
    logger.d('🔢 Status code: ${response.statusCode}');
    logger.d('📦 Body: ${response.body}');

    if (response.statusCode == 200) {
      return _handleResponse<CartModel>(
        response,
        (json) => CartModel.fromJson(json['updatedCart']),
      );
    } else {
      throw Exception(
        'Failed to clear cart. Status code: ${response.statusCode}',
      );
    }
  }

  Future<InvoiceModel> checkout(CheckoutRequestModel request) async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId').toString();

    final uri = Uri.parse('$baseUrl/checkout?userId=$userId');

    logger.i('📤 Enviando solicitud de checkout');
    logger.d('🧠 URI: $uri');
    logger.d('🧠 Headers: $headers');
    logger.d('🧠 Body: ${jsonEncode(request.toJson())}');

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode(request.toJson()),
    );

    logger.i('✅ Respuesta recibida');
    logger.d('🔢 Status code: ${response.statusCode}');
    logger.d('📦 Body: ${response.body}');

    return _handleResponse<InvoiceModel>(
      response,
      (json) => InvoiceModel.fromJson(json),
    );
  }

  Future<List<PurchaseModel>> getPurchases() async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId')?.toString();
    final uri = Uri.parse('$baseUrl/purchases?userId=$userId');
    final response = await http.get(uri, headers: headers);
    return _handleResponse<List<PurchaseModel>>(
      response,
      (json) => (json as List).map((e) => PurchaseModel.fromJson(e)).toList(),
    );
  }

  Future<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic) parser,
  ) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final jsonData = jsonDecode(response.body);
      return parser(jsonData);
    } else {
      logger.e('Error HTTP ${response.statusCode}', error: response.body);
      throw Exception('Error en la solicitud: ${response.reasonPhrase}');
    }
  }
}
