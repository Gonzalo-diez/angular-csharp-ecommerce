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
  double? _minPrice;
  double? _maxPrice;
  ProductSubCategory? _selectedSubCategoryEnum;
  ProductStatus? _selectedStatusEnum;

  final TextEditingController _minPriceController = TextEditingController();
  final TextEditingController _maxPriceController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _productsFuture = _loadProducts();
  }

  Future<List<ProductModel>> _loadProducts() async {
    try {
      return await _productService.getProductsByCategory(
        category: widget.category.name,
        minPrice: _minPrice,
        maxPrice: _maxPrice,
        subCategory: _selectedSubCategoryEnum,
        status: _selectedStatusEnum,
      );
    } catch (e) {
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

  void _applyFilters() {
    setState(() {
      _minPrice = double.tryParse(_minPriceController.text);
      _maxPrice = double.tryParse(_maxPriceController.text);
      _productsFuture = _loadProducts();
    });
  }

  void _clearFilters() {
    setState(() {
      _minPriceController.clear();
      _maxPriceController.clear();
      _minPrice = null;
      _maxPrice = null;
      _selectedSubCategoryEnum = null;
      _selectedStatusEnum = null;
      _productsFuture = _loadProducts();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_getCategoryTitle(widget.category))),
      body: Column(
        children: [
          // FILTROS
          ExpansionTile(
            title: const Text('Filtros'),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    TextField(
                      controller: _minPriceController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Precio mínimo',
                      ),
                    ),
                    TextField(
                      controller: _maxPriceController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Precio máximo',
                      ),
                    ),
                    DropdownButton<ProductSubCategory>(
                      value: _selectedSubCategoryEnum,
                      hint: const Text('Subcategoría'),
                      isExpanded: true,
                      items:
                          ProductSubCategory.values.map((sub) {
                            return DropdownMenuItem(
                              value: sub,
                              child: Text(sub.name),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedSubCategoryEnum = value;
                        });
                      },
                    ),
                    DropdownButton<ProductStatus>(
                      value: _selectedStatusEnum,
                      hint: const Text('Estado'),
                      isExpanded: true,
                      items:
                          ProductStatus.values.map((status) {
                            return DropdownMenuItem(
                              value: status,
                              child: Text(status.name),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedStatusEnum = value;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _applyFilters,
                            child: const Text('Aplicar filtros'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _clearFilters,
                            child: const Text('Limpiar'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          // RESULTADOS
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
        onTap: () {},
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
