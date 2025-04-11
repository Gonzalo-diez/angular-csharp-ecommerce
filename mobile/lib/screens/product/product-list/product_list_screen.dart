import 'package:flutter/material.dart';
import '../../../models/product/product_model.dart';
import '../../../services/product/product_service.dart';
import '../../../screens/product/product-item/product_item_screen.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({super.key});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  final ProductService _productService = ProductService();
  late Future<List<ProductModel>> _productsFuture;

  // Filtros
  double? _minPrice;
  double? _maxPrice;
  ProductStatus? _selectedStatus;
  ProductCategory? _selectedCategoryEnum;
  ProductSubCategory? _selectedSubCategoryEnum;

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  void _fetchProducts() {
    setState(() {
      _productsFuture = _productService.getAllProducts(
        minPrice: _minPrice,
        maxPrice: _maxPrice,
        status: _selectedStatus,
        category: _selectedCategoryEnum,
        subCategory: _selectedSubCategoryEnum,
      );
    });
  }

  void _openFilterDialog() {
    ProductStatus? tempStatus = _selectedStatus;
    ProductCategory? tempCategory = _selectedCategoryEnum;
    ProductSubCategory? tempSubCategory = _selectedSubCategoryEnum;

    TextEditingController minPriceController = TextEditingController(
      text: _minPrice?.toString() ?? '',
    );
    TextEditingController maxPriceController = TextEditingController(
      text: _maxPrice?.toString() ?? '',
    );

    List<ProductSubCategory> getSubCategoriesForCategory(
      ProductCategory category,
    ) {
      switch (category) {
        case ProductCategory.technology:
          return [
            ProductSubCategory.pc,
            ProductSubCategory.console,
            ProductSubCategory.smartphone,
          ];
        case ProductCategory.clothing:
          return [
            ProductSubCategory.men,
            ProductSubCategory.women,
            ProductSubCategory.kids,
          ];
        case ProductCategory.home:
          return [
            ProductSubCategory.furniture,
            ProductSubCategory.kitchen,
            ProductSubCategory.decor,
          ];
      }
    }

    String enumToReadableString(String value) {
      return value[0].toUpperCase() + value.substring(1).replaceAll('_', ' ');
    }

    List<ProductSubCategory> availableSubCategories =
        tempCategory != null ? getSubCategoriesForCategory(tempCategory) : [];

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setStateDialog) {
            return AlertDialog(
              title: const Text('Filtrar productos'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: minPriceController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Precio mínimo',
                      ),
                    ),
                    TextField(
                      controller: maxPriceController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Precio máximo',
                      ),
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<ProductStatus>(
                      isExpanded: true,
                      value: tempStatus,
                      hint: const Text('Seleccionar estado'),
                      items:
                          ProductStatus.values.map((status) {
                            return DropdownMenuItem(
                              value: status,
                              child: Text(_formatStatus(status)),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setStateDialog(() {
                          tempStatus = value;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<ProductCategory>(
                      isExpanded: true,
                      value: tempCategory,
                      hint: const Text('Seleccionar categoría'),
                      items:
                          ProductCategory.values.map((cat) {
                            return DropdownMenuItem(
                              value: cat,
                              child: Text(enumToReadableString(cat.name)),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setStateDialog(() {
                          tempCategory = value;
                          availableSubCategories = getSubCategoriesForCategory(
                            value!,
                          );
                          tempSubCategory = null;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<ProductSubCategory>(
                      isExpanded: true,
                      value: tempSubCategory,
                      hint: const Text('Seleccionar subcategoría'),
                      items:
                          availableSubCategories.map((sub) {
                            return DropdownMenuItem(
                              value: sub,
                              child: Text(enumToReadableString(sub.name)),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setStateDialog(() {
                          tempSubCategory = value;
                        });
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _minPrice = double.tryParse(minPriceController.text);
                      _maxPrice = double.tryParse(maxPriceController.text);
                      _selectedStatus = tempStatus;
                      _selectedCategoryEnum = tempCategory;
                      _selectedSubCategoryEnum = tempSubCategory;
                    });
                    _fetchProducts();
                    Navigator.of(context).pop();
                  },
                  child: const Text('Aplicar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  static String _formatStatus(ProductStatus status) {
    switch (status) {
      case ProductStatus.enable:
        return 'Disponible';
      case ProductStatus.outOfStock:
        return 'Agotado';
      case ProductStatus.disable:
        return 'Deshabilitado';
    }
  }

  String _capitalize(String value) {
    return value[0].toUpperCase() + value.substring(1);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Productos'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _openFilterDialog,
          ),
        ],
      ),
      body: FutureBuilder<List<ProductModel>>(
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
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder:
                            (_) => ProductItemScreen(productId: product.id.toString()),
                      ),
                    );
                  },
                  leading:
                      product.imageUrl != null
                          ? Image.network(
                            'http://192.168.1.6:5180${product.imageUrl!}',
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
}
