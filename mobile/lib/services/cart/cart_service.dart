import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/cart/cart_model.dart';
import '../../models/invoice/invoice_model.dart';
import '../../models/purchase/purchase_model.dart';
import '../../models/invoice/checkout_request_model.dart';

class CartService {
  final String baseUrl = 'http://192.168.1.6:5180/api/cart';
  final logger = Logger();

  Future<Map<String, String>> _getAuthHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception('No se encontró el token');

    logger.i('Token: $token');

    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }

  // ✅ Obtener carrito del usuario
  Future<CartModel> getCart() async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId').toString();

    final uri = Uri.parse('$baseUrl?userId=$userId');

    final response = await http.get(uri, headers: headers);

    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Agregar producto al carrito
  Future<CartModel> addProductToCart(int productId, int quantity) async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId').toString();

    final uri = Uri.parse('$baseUrl/add?userId=$userId');

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'productId': productId, 'quantity': quantity}),
    );

    logger.i(
      'Agregando producto al carrito: userId=$userId, productId=$productId, quantity=$quantity',
    );

    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Eliminar producto del carrito
  Future<CartModel> removeFromCart(int productId) async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();

    final rawUserId = prefs.getInt('userId');
    if (rawUserId == null) {
      logger.e('❌ userId is null in SharedPreferences');
      throw Exception('userId is null');
    }

    final userId = rawUserId.toString();
    final uri = Uri.parse('$baseUrl/remove/$productId?userId=$userId');

    logger.i('🧾 Eliminando producto del carrito...');
    logger.d('productId: $productId');
    logger.d('userId: $userId');
    logger.d('URI: $uri');
    logger.d('Headers: $headers');

    final response = await http.delete(uri, headers: headers);

    logger.d('Status Code: ${response.statusCode}');
    logger.d('Response Body: ${response.body}');

    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Vaciar carrito
  Future<CartModel> clearCart() async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId').toString();

    final uri = Uri.parse('$baseUrl/clear?userId=$userId');

    final response = await http.delete(uri, headers: headers);
    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Realizar checkout
  Future<InvoiceModel> checkout(CheckoutRequestModel request) async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId').toString();

    final uri = Uri.parse('$baseUrl/checkout?userId=$userId');

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode(request.toJson()),
    );
    return _handleResponse<InvoiceModel>(
      response,
      (json) => InvoiceModel.fromJson(json),
    );
  }

  // ✅ Obtener compras del usuario
  Future<List<PurchaseModel>> getPurchases() async {
    final prefs = await SharedPreferences.getInstance();
    final headers = await _getAuthHeaders();
    final userId = prefs.getInt('userId').toString();

    final uri = Uri.parse('$baseUrl/purchases?userId=$userId');

    final response = await http.get(uri, headers: headers);
    return _handleResponse<List<PurchaseModel>>(
      response,
      (json) => (json as List).map((e) => PurchaseModel.fromJson(e)).toList(),
    );
  }

  // 🔥 Manejo de errores y parsing con Logger
  Future<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic) parser,
  ) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final jsonData = jsonDecode(response.body);
      logger.i('📦 JSON recibido: $jsonData');
      return parser(jsonData);
    } else {
      logger.e('❌ Error HTTP ${response.statusCode}', error: response.body);
      throw Exception('Error en la solicitud: ${response.reasonPhrase}');
    }
  }
}
