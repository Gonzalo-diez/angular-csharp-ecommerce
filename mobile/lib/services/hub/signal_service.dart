import 'package:logger/logger.dart';
import 'package:signalr_netcore/signalr_client.dart';

class SignalService {
  static final SignalService _instance = SignalService._internal();
  factory SignalService() => _instance;

  SignalService._internal();

  final Logger _logger = Logger();

  // URL del backend
  final String baseUrl = 'http://192.168.1.6:5180';

  HubConnection? _productHub;
  HubConnection? _cartHub;
  HubConnection? _authHub;

  // Iniciar todas las conexiones
  Future<void> initConnections(String userId) async {
    await _initProductHub();
    await _initCartHub(userId);
    await _initAuthHub();
  }

  // -------------------- PRODUCT HUB --------------------
  Future<void> _initProductHub() async {
    _productHub =
        HubConnectionBuilder()
            .withUrl('$baseUrl/productHub')
            .withAutomaticReconnect()
            .build();

    _productHub?.on('ProductAdded', (args) {
      final product = args?[0];
      _logger.i('🟢 Producto agregado: $product');
    });

    _productHub?.on('ProductUpdated', (args) {
      final product = args?[0];
      _logger.w('🟡 Producto actualizado: $product');
    });

    _productHub?.on('ProductDeleted', (args) {
      final productId = args?[0];
      _logger.e('🔴 Producto eliminado: $productId');
    });

    await _productHub?.start();
    _logger.i('✅ ProductHub conectado');
  }

  // -------------------- CART HUB --------------------
  Future<void> _initCartHub(String userId) async {
    _cartHub =
        HubConnectionBuilder()
            .withUrl('$baseUrl/cartHub')
            .withAutomaticReconnect()
            .build();

    _cartHub?.on('CartUpdated', (args) {
      final cart = args?[0];
      _logger.i('🛒 Carrito actualizado para $userId: $cart');
    });

    _cartHub?.on('CartCleared', (args) {
      _logger.i('🧹 Carrito limpiado para $userId');
    });

    await _cartHub?.start();
    _logger.i('✅ CartHub conectado');
  }

  // -------------------- AUTH HUB --------------------
  Future<void> _initAuthHub() async {
    _authHub =
        HubConnectionBuilder()
            .withUrl('$baseUrl/authHub')
            .withAutomaticReconnect()
            .build();

    _authHub?.on('UserLoggedIn', (args) {
      final user = args?[0];
      _logger.i('🔓 Usuario logueado: $user');
    });

    _authHub?.on('UserLoggedOut', (args) {
      final user = args?[0];
      _logger.w('🔒 Usuario deslogueado: $user');
    });

    await _authHub?.start();
    _logger.i('✅ AuthHub conectado');
  }

  // -------------------- CERRAR CONEXIONES --------------------
  Future<void> dispose() async {
    await _productHub?.stop();
    await _cartHub?.stop();
    await _authHub?.stop();
    _logger.i('❌ Conexiones cerradas');
  }
}
