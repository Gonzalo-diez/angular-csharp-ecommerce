import 'package:flutter/material.dart';
import '../../../models/product/product_model.dart';
import '../../../services/product/product_service.dart';

class ProductSearchScreen extends StatefulWidget {
  final String query;

  const ProductSearchScreen({super.key, required this.query});

  @override
  State<ProductSearchScreen> createState() => _ProductSearchScreenState();
}

class _ProductSearchScreenState extends State<ProductSearchScreen> {
  late Future<List<ProductModel>> _results;

  @override
  void initState() {
    super.initState();
    _results = ProductService().searchProducts(widget.query);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Resultados para "${widget.query}"'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 2,
      ),
      body: FutureBuilder<List<ProductModel>>(
        future: _results,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('❌ Error: ${snapshot.error}'));
          }

          final products = snapshot.data ?? [];

          if (products.isEmpty) {
            return const Center(child: Text('No se encontraron productos.'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];

              return Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                margin: const EdgeInsets.symmetric(vertical: 8),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(12),
                  leading:
                      product.imageUrl != null
                          ? ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              'http://192.168.1.6:5180${product.imageUrl!}',
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                            ),
                          )
                          : const Icon(Icons.image_not_supported, size: 50),
                  title: Text(
                    product.name,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Text('\$${product.price.toStringAsFixed(2)}'),
                      const SizedBox(height: 2),
                    ],
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {
                    // Aquí podrías navegar al detalle del producto
                    // Navigator.pushNamed(context, '/product/${product.id}');
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
