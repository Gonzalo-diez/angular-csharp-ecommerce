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
    final userId = prefs.getInt('userId').toString();

    if (token == null) throw Exception('No se encontró el token');

    logger.i('Token: $token');
    logger.i('🪪 userId obtenido del token: $userId');

    return {
      'Authorization': 'Bearer $token',
      'userId': userId,
      'Content-Type': 'application/json',
    };
  }

  // ✅ Obtener carrito del usuario
  Future<CartModel> getCart() async {
    final headers = await _getAuthHeaders();

    final response = await http.get(
      Uri.parse(baseUrl),
      headers: headers,
    );
    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Agregar producto al carrito
  Future<CartModel> addProductToCart(int productId, int quantity) async {
    final headers = await _getAuthHeaders();

    final response = await http.post(
      Uri.parse('$baseUrl/add'),
      headers: headers,
      body: jsonEncode({'productId': productId, 'quantity': quantity}),
    );
    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Eliminar producto del carrito
  Future<CartModel> removeFromCart(int productId) async {
    final headers = await _getAuthHeaders();

    final response = await http.delete(
      Uri.parse('$baseUrl/remove/$productId'),
      headers: headers,
    );
    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Vaciar carrito
  Future<CartModel> clearCart() async {
    final headers = await _getAuthHeaders();

    final response = await http.delete(
      Uri.parse('$baseUrl/clear'),
      headers: headers,
    );
    return _handleResponse<CartModel>(
      response,
      (json) => CartModel.fromJson(json),
    );
  }

  // ✅ Realizar checkout
  Future<InvoiceModel> checkout(CheckoutRequestModel request) async {
    final headers = await _getAuthHeaders();

    final response = await http.post(
      Uri.parse('$baseUrl/checkout'),
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
    final headers = await _getAuthHeaders();

    final response = await http.get(
      Uri.parse('$baseUrl/purchases'),
      headers: headers,
    );
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
      return parser(jsonData);
    } else {
      logger.e('❌ Error HTTP ${response.statusCode}', error: response.body);
      throw Exception('Error en la solicitud: ${response.reasonPhrase}');
    }
  }
}
