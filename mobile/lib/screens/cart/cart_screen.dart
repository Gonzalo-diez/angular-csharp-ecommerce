import 'package:flutter/material.dart';
import 'package:mobile/models/cart/cart_model.dart';
import 'package:mobile/services/cart/cart_service.dart';

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

  Future<void> _removeProduct(int productId) async {
    try {
      await _cartService.removeFromCart(productId);

      setState(() {
        cart!.items.removeWhere((item) => item.product.id == productId);
      });

      if (cart == null || cart!.items.isEmpty) {
        setState(() {
          cart = null;
        });
      }
    } catch (e) {
      setState(() => error = e.toString());
    }
  }

  Future<void> _clearCart() async {
    try {
      await _cartService.clearCart();

      setState(() {
        cart!.items.clear();
      });
    } catch (e) {
      setState(() => error = e.toString());
    }
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
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : error != null
              ? Center(child: Text('Error: $error'))
              : (cart == null || cart!.items.isEmpty)
              ? const Center(child: Text('🛒 El carrito está vacío'))
              : Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      itemCount: cart!.items.length,
                      itemBuilder: (context, index) {
                        final item = cart!.items[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(
                            vertical: 6,
                            horizontal: 12,
                          ),
                          child: ListTile(
                            leading: const Icon(Icons.shopping_cart),
                            title: Text(item.product.name),
                            subtitle: Text(
                              'Precio: \$${item.product.price.toStringAsFixed(2)}\nCantidad: ${item.quantity}',
                            ),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () => _removeProduct(item.product.id),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const Divider(),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'Total: \$${_calculateTotal().toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.end,
                    ),
                  ),
                ],
              ),
    );
  }
}
