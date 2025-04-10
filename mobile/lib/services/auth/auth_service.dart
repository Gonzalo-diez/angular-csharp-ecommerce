import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../../models/auth/auth_model.dart';
import '../../models/auth/auth_role.dart';

class AuthService with ChangeNotifier {
  static const String _baseUrl = 'http://192.168.1.6:5180/api/auth';
  final logger = Logger();

  bool _isAuthenticated = false;
  String? _token;

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;

  AuthService() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _isAuthenticated = _token != null;
    notifyListeners();
  }

  Future<bool> login(
    String email,
    String password,
    BuildContext context,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _token = data['token'];

        if (kDebugMode && _token != null) {
          logger.i('💡 Token recibido: $_token');
        }

        final decodedToken = JwtDecoder.decode(_token!);
        logger.i('📦 Token decodificado: $decodedToken');

        // Obtener usuario
        dynamic userRaw = decodedToken['user'];

        if (userRaw == null) {
          logger.e('❌ El token no contiene el campo "user".');
          return false;
        }

        Map<String, dynamic> userMap;
        try {
          userMap =
              userRaw is String
                  ? jsonDecode(userRaw)
                  : Map<String, dynamic>.from(userRaw);
        } catch (e) {
          logger.e('❌ Error al decodificar userMap: $e');
          return false;
        }

        final user = AuthModel.fromJson(userMap);

        // Guardar datos en SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        int? userId;

        final dynamic rawId = userMap['Id'] ?? userMap['id'];
        if (rawId is int) {
          userId = rawId;
        } else if (rawId is String) {
          userId = int.tryParse(rawId);
        }

        if (userId != null) {
          await prefs.setInt('userId', userId);
          logger.i('🆔 userId guardado: $userId');
        } else {
          logger.w('⚠️ userId no encontrado o inválido');
        }

        await prefs.setString('token', _token!);
        await prefs.setString('role', user.role.name);

        _isAuthenticated = true;
        notifyListeners();

        // ✅ Redirección según rol
        if (!context.mounted) return true;

        if (user.role == AuthRole.admin) {
          logger.i("🚨 Usuario admin detectado. Redirigiendo al dashboard...");
          Navigator.of(context).pushReplacementNamed('/dashboard');
        } else {
          logger.i("👤 Usuario regular detectado. Redirigiendo al home...");
          Navigator.of(context).pushReplacementNamed('/home');
        }

        return true;
      } else {
        throw Exception(jsonDecode(response.body)['message']);
      }
    } catch (e) {
      debugPrint('Login error: $e');
      return false;
    }
  }

  Future<bool> register(
    String firstName,
    String lastName,
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
        }),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      debugPrint('Register error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await http.post(Uri.parse('$_baseUrl/logout'));
    } catch (e) {
      debugPrint('Logout request failed, proceeding to clear local data.');
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _token = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>?> getUserById(int userId) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/$userId'),
      headers: {
        'Authorization': 'Bearer $_token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return null;
  }

  Future<bool> deleteUser(int userId) async {
    final response = await http.delete(
      Uri.parse('$_baseUrl/delete/$userId'),
      headers: {
        'Authorization': 'Bearer $_token',
        'Content-Type': 'application/json',
      },
    );

    return response.statusCode == 200;
  }
}
