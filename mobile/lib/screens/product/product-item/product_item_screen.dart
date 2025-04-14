import 'package:flutter/material.dart';
import '../../../models/product/product_model.dart';
import '../../../services/product/product_service.dart';
import '../../../services/cart/cart_service.dart';

class ProductItemScreen extends StatefulWidget {
  final String productId;

  const ProductItemScreen({super.key, required this.productId});

  @override
  State<ProductItemScreen> createState() => _ProductItemScreenState();
}

class _ProductItemScreenState extends State<ProductItemScreen> {
  late Future<ProductModel> _product;
  int _quantity = 1;
  final _cartService = CartService();

  @override
  void initState() {
    super.initState();
    _product = ProductService().getProductById(int.parse(widget.productId));
  }

  void _showSnackBar(String message, {Color color = Colors.green}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalle del Producto'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 2,
      ),
      body: FutureBuilder<ProductModel>(
        future: _product,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('❌ Error: ${snapshot.error}'));
          }

          final product = snapshot.data!;
          final stock = product.stock;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Imagen
                if (product.imageUrl != null && product.imageUrl!.isNotEmpty)
                  Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        'http://192.168.1.6:5180${product.imageUrl!}',
                        height: 150,
                        width: 150,
                        fit: BoxFit.cover,
                      ),
                    ),
                  )
                else
                  Container(
                    height: 250,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.image_not_supported, size: 80),
                  ),
                const SizedBox(height: 20),

                // Nombre
                Text(
                  product.name,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),

                // Precio
                Text(
                  '\$${product.price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 20,
                    color: Colors.green,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 20),

                // Selector de cantidad
                Row(
                  children: [
                    const Text('Cantidad: ', style: TextStyle(fontSize: 16)),
                    IconButton(
                      icon: const Icon(Icons.remove),
                      onPressed: _quantity > 1
                          ? () => setState(() => _quantity--)
                          : null,
                    ),
                    Text('$_quantity', style: const TextStyle(fontSize: 16)),
                    IconButton(
                      icon: const Icon(Icons.add),
                      onPressed: _quantity < stock
                          ? () => setState(() => _quantity++)
                          : null,
                    ),
                    Text('(Stock: $stock)'),
                  ],
                ),
                const SizedBox(height: 20),

                // Botón para agregar al carrito
                ElevatedButton.icon(
                  onPressed: stock > 0
                      ? () async {
                          try {
                            await _cartService.addProductToCart(
                              product.id,
                              _quantity,
                            );
                            _showSnackBar('✅ Producto agregado al carrito');
                          } catch (e) {
                            _showSnackBar('❌ Error al agregar al carrito', color: Colors.red);
                          }
                        }
                      : null,
                  icon: const Icon(Icons.add_shopping_cart),
                  label: const Text('Agregar al carrito'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    minimumSize: const Size(double.infinity, 48),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
