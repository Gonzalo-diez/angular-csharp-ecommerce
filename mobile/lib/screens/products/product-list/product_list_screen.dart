import 'package:flutter/material.dart';
import '../../../models/product/product_model.dart';
import '../../../services/product/product_service.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({super.key});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  final ProductService _productService = ProductService();
  late Future<List<Product>> _productsFuture;

  @override
  void initState() {
    super.initState();
    _productsFuture = _productService.getAllProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Productos'),
        centerTitle: true,
      ),
      body: FutureBuilder<List<Product>>(
        future: _productsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final products = snapshot.data!;

          if (products.isEmpty) {
            return const Center(child: Text('No hay productos disponibles.'));
          }

          return ListView.builder(
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                child: ListTile(
                  leading:
                      product.imageUrl != null
                          ? Image.network(
                            'http://10.0.2.2:5169${product.imageUrl!}',
                            width: 100,
                            height: 60,
                            fit: BoxFit.cover,
                            errorBuilder:
                                (context, error, stackTrace) =>
                                    const Icon(Icons.broken_image),
                          )
                          : const Icon(Icons.image_not_supported),
                  title: Text(product.name),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Marca: ${product.brand}'),
                      Text('Precio: \$${product.price.toStringAsFixed(2)}'),
                      Text('Stock: ${product.stock}'),
                      Text(
                        'Categoría: ${_capitalize(product.category.name)} - ${_capitalize(product.subCategory.name)}',
                      ),
                      Text('Estado: ${_formatStatus(product.status)}'),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _capitalize(String value) {
    return value[0].toUpperCase() + value.substring(1);
  }

  String _formatStatus(ProductStatus status) {
    switch (status) {
      case ProductStatus.enable:
        return 'Disponible';
      case ProductStatus.outOfStock:
        return 'Agotado';
      case ProductStatus.disable:
        return 'Deshabilitado';
    }
  }
}
