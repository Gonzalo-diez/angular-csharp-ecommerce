import 'package:flutter/material.dart';
import 'package:mobile/models/product/product_model.dart';
import 'package:mobile/services/product/product_service.dart';

class ProductCategoryScreen extends StatefulWidget {
  final ProductCategory category;

  const ProductCategoryScreen({super.key, required this.category});

  @override
  State<ProductCategoryScreen> createState() => _ProductCategoryScreenState();
}

class _ProductCategoryScreenState extends State<ProductCategoryScreen> {
  final ProductService _productService = ProductService();
  late Future<List<ProductModel>> _productsFuture;

  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _productsFuture = _loadProducts();
  }

  Future<List<ProductModel>> _loadProducts() async {
    try {
      return await _productService.getProductsByCategory(
        category: widget.category.name,
      );
    } catch (e) {
      // Comprobar si el error es un 404
      if (e.toString().contains('404')) {
        setState(() {
          _errorMessage =
              'No hay productos en la categoría ${_getCategoryTitle(widget.category)}.';
        });
      } else {
        setState(() {
          _errorMessage = 'Error al cargar productos: ${e.toString()}';
        });
      }
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_getCategoryTitle(widget.category))),
      body:
          _errorMessage != null
              ? Center(child: Text(_errorMessage!, textAlign: TextAlign.center))
              : FutureBuilder<List<ProductModel>>(
                future: _productsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  final products = snapshot.data ?? [];

                  if (products.isEmpty) {
                    return Center(
                      child: Text(
                        'No hay productos disponibles.',
                        style: const TextStyle(fontSize: 16),
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: products.length,
                    itemBuilder:
                        (context, index) =>
                            _buildProductItem(context, products[index]),
                  );
                },
              ),
    );
  }

  Widget _buildProductItem(BuildContext context, ProductModel product) {
    return Card(
      elevation: 3,
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
                : const Icon(Icons.image_not_supported, size: 40),
        title: Text(
          product.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          '${product.brand} - \$${product.price.toStringAsFixed(2)}',
        ),
        trailing: Text('Stock: ${product.stock}'),
        onTap: () {
          // Detalle producto
        },
      ),
    );
  }

  String _getCategoryTitle(ProductCategory category) {
    switch (category) {
      case ProductCategory.technology:
        return 'Tecnología';
      case ProductCategory.clothing:
        return 'Ropa';
      case ProductCategory.home:
        return 'Hogar';
    }
  }
}
