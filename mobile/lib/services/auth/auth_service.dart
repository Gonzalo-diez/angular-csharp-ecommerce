import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mobile/models/auth/auth_model.dart';
import 'package:mobile/models/auth/auth_role.dart';

class AuthService with ChangeNotifier {
  static const String _baseUrl = 'http://192.168.1.6:5180/api/auth';
  final logger = Logger();

  bool _isAuthenticated = false;
  String? _token;
  int? _userId;
  String? _role;

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  int? get userId => _userId;
  String? get role => _role;

  bool get isAdmin => _role == 'admin';
  bool get isPremium => _role == 'premium';
  bool get isUser => _role == 'user';

  AuthService() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _userId = prefs.getInt('userId');
    _role = prefs.getString('role');
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
          _userId = userId;
          await prefs.setInt('userId', userId);
          logger.i('🆔 userId guardado: $userId');
        } else {
          logger.w('⚠️ userId no encontrado o inválido');
        }

        _role = user.role.name;
        await prefs.setString('role', _role!);
        await prefs.setString('token', _token!);

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
    File? image,
  ) async {
    try {
      var uri = Uri.parse('$_baseUrl/register');
      var request = http.MultipartRequest('POST', uri);

      // Campos de texto
      request.fields['firstName'] = firstName;
      request.fields['lastName'] = lastName;
      request.fields['email'] = email;
      request.fields['password'] = password;

      // Imagen (si se seleccionó una)
      if (image != null) {
        request.files.add(
          await http.MultipartFile.fromPath('imageAvatar', image.path),
        );
      }

      // Enviar la request
      var response = await request.send();

      // Leer respuesta completa
      var responseBody = await response.stream.bytesToString();
      debugPrint(responseBody);

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
    await prefs.remove('userId');
    _token = null;
    _userId = null;
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

  Future<bool> upgradeRole({
    required String paymentMethod,
    required String cardNumber,
    required String securityNumber,
  }) async {
    if (_token == null || _userId == null) {
      logger.e("⛔️ No hay token o userId disponible.");
      return false;
    }

    try {
      final uri = Uri.parse(
        '$_baseUrl/upgrade',
      ).replace(queryParameters: {'userId': _userId});

      final response = await http.post(
        uri,
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'paymentMethod': paymentMethod,
          'cardNumber': cardNumber,
          'securityNumber': securityNumber,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        logger.i("✨ Upgrade exitoso: ${data['message']}");

        _role = data['user']['role'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('role', _role!);

        notifyListeners();
        return true;
      } else {
        try {
          final decoded = jsonDecode(response.body);
          final error =
              decoded is Map<String, dynamic>
                  ? decoded['message']
                  : 'Error desconocido';
          logger.w("⚠️ Error al hacer upgrade: $error");
        } catch (e) {
          logger.e("❌ Error decodificando el error: $e");
        }
        return false;
      }
    } catch (e) {
      logger.e("❌ Error en upgradeRole: $e");
      return false;
    }
  }
}
