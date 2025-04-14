import 'package:flutter/material.dart';
import 'package:mobile/models/product/product_model.dart';
import 'package:mobile/services/product/product_service.dart';

class ProductSubcategoryScreen extends StatefulWidget {
  final ProductCategory category;
  final ProductSubCategory subCategory;

  const ProductSubcategoryScreen({
    super.key,
    required this.category,
    required this.subCategory,
  });

  @override
  State<ProductSubcategoryScreen> createState() =>
      _ProductSubcategoryScreenState();
}

class _ProductSubcategoryScreenState extends State<ProductSubcategoryScreen> {
  final ProductService _productService = ProductService();
  late Future<List<ProductModel>> _productsFuture;

  double? _minPrice;
  double? _maxPrice;
  ProductStatus? _status;
  String? _errorMessage;

  final _minPriceController = TextEditingController();
  final _maxPriceController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _productsFuture = _loadProducts();
  }

  Future<List<ProductModel>> _loadProducts() async {
    try {
      final products = await _productService.getProductsBySubcategory(
        category: widget.category.name,
        subCategory: widget.subCategory.name,
        minPrice: _minPrice,
        maxPrice: _maxPrice,
        status: _status,
      );
      return products;
    } catch (e) {
      if (e.toString().contains('404')) {
        setState(() {
          _errorMessage =
              'No hay productos en la subcategoría "${_getSubcategoryTitle(widget.subCategory)}".';
        });
      } else {
        setState(() {
          _errorMessage = 'Error al cargar productos: ${e.toString()}';
        });
      }
      return [];
    }
  }

  void _applyFilters() {
    setState(() {
      _minPrice = double.tryParse(_minPriceController.text);
      _maxPrice = double.tryParse(_maxPriceController.text);
      _productsFuture = _loadProducts();
    });
  }

  @override
  void dispose() {
    _minPriceController.dispose();
    _maxPriceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_getSubcategoryTitle(widget.subCategory))),
      body: Column(
        children: [
          _buildFilters(),
          Expanded(
            child:
                _errorMessage != null
                    ? Center(
                      child: Text(_errorMessage!, textAlign: TextAlign.center),
                    )
                    : FutureBuilder<List<ProductModel>>(
                      future: _productsFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Center(
                            child: CircularProgressIndicator(),
                          );
                        }

                        final products = snapshot.data ?? [];

                        if (products.isEmpty) {
                          return const Center(
                            child: Text(
                              'No hay productos disponibles.',
                              style: TextStyle(fontSize: 16),
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
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _minPriceController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Precio mínimo'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _maxPriceController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Precio máximo'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          DropdownButton<ProductStatus>(
            value: _status,
            hint: const Text('Filtrar por estado'),
            isExpanded: true,
            items:
                ProductStatus.values.map((ProductStatus status) {
                  return DropdownMenuItem<ProductStatus>(
                    value: status,
                    child: Text(status.name.toUpperCase()),
                  );
                }).toList(),
            onChanged: (ProductStatus? newValue) {
              setState(() {
                _status = newValue;
              });
            },
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _applyFilters,
            icon: const Icon(Icons.filter_alt),
            label: const Text('Aplicar filtros'),
          ),
        ],
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
          // Acción al tocar el producto
        },
      ),
    );
  }

  String _getSubcategoryTitle(ProductSubCategory subCategory) {
    switch (subCategory) {
      case ProductSubCategory.pc:
        return 'PC';
      case ProductSubCategory.console:
        return 'Consolas';
      case ProductSubCategory.smartphone:
        return 'Smartphones';
      case ProductSubCategory.men:
        return 'Hombres';
      case ProductSubCategory.women:
        return 'Mujeres';
      case ProductSubCategory.kids:
        return 'Niños';
      case ProductSubCategory.furniture:
        return 'Muebles';
      case ProductSubCategory.kitchen:
        return 'Cocina';
      case ProductSubCategory.decor:
        return 'Decoración';
    }
  }
}
