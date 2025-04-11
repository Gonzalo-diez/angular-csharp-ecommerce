import 'package:flutter/material.dart';
import '../../models/cart/cart_model.dart';
import '../../services/cart/cart_service.dart';
import '../../models/cart/cart_item_model.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final CartService _cartService = CartService();
  CartModel? cart;
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadCart();
  }

  Future<void> _loadCart() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final result = await _cartService.getCart();
      setState(() {
        cart = result;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _changeQuantity(CartItemModel item, int delta) async {
    final newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    await _cartService.addProductToCart(item.product.id, delta);
    await _loadCart();
  }

  Future<void> _removeProduct(int productId) async {
    await _cartService.removeFromCart(productId);
    await _loadCart();
  }

  Future<void> _clearCart() async {
    await _cartService.clearCart();
    await _loadCart();
  }

  double _calculateTotal() {
    final items = cart?.items;
    if (items == null) return 0.0;

    return items.fold(0.0, (sum, item) {
      return sum + item.product.price * item.quantity;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const Center(child: CircularProgressIndicator());

    if (error != null) {
      return Center(child: Text('Error: $error'));
    }

    if (cart == null || cart!.items.isEmpty) {
      return const Center(child: Text('🛒 El carrito está vacío'));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Carrito'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_forever),
            onPressed: _clearCart,
            tooltip: 'Vaciar carrito',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: [
          ...cart!.items.map((item) {
            return Card(
              margin: const EdgeInsets.symmetric(vertical: 6),
              child: ListTile(
                leading: const Icon(Icons.shopping_cart),
                title: Text(item.product.name),
                subtitle: Text(
                  'Precio: \$${item.product.price.toStringAsFixed(2)}',
                ),
                trailing: SizedBox(
                  width: 180,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.remove),
                        onPressed: () => _changeQuantity(item, -1),
                      ),
                      Text(
                        item.quantity.toString(),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add),
                        onPressed: () => _changeQuantity(item, 1),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _removeProduct(item.product.id),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
          const Divider(),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Total: \$${_calculateTotal().toStringAsFixed(2)}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              textAlign: TextAlign.end,
            ),
          ),
        ],
      ),
    );
  }
}
