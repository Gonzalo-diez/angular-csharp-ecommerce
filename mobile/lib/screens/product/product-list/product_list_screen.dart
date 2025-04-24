import 'package:flutter/material.dart';
import 'package:mobile/models/product/product_model.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/auth/auth_service.dart';
import 'package:mobile/services/product/product_service.dart';
import 'package:mobile/screens/product/product-item/product_item_screen.dart';
import 'package:mobile/screens/product/product-add/product_add_screen.dart';
import 'package:mobile/screens/product/product-update/product_update_screen.dart';

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
    final auth = Provider.of<AuthService>(context, listen: false);
    final currentUserId = auth.userId;

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
                            (_) => ProductItemScreen(
                              productId: product.id,
                            ),
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
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Mostrar botón de editar solo si el usuario es el dueño
                      if (product.ownerId == currentUserId)
                        IconButton(
                          icon: const Icon(Icons.edit, color: Colors.blue),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder:
                                    (_) => ProductUpdateScreen(
                                      productId: product.id,
                                      product: product,
                                    ),
                              ),
                            );
                          },
                        ),

                      // Mostrar botón de eliminar si es el dueño o admin
                      if (product.ownerId == currentUserId || auth.isAdmin)
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder:
                                  (context) => AlertDialog(
                                    title: const Text('Confirmar eliminación'),
                                    content: const Text(
                                      '¿Estás seguro de que querés eliminar este producto?',
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed:
                                            () => Navigator.of(
                                              context,
                                            ).pop(false),
                                        child: const Text('Cancelar'),
                                      ),
                                      ElevatedButton(
                                        onPressed:
                                            () =>
                                                Navigator.of(context).pop(true),
                                        child: const Text('Eliminar'),
                                      ),
                                    ],
                                  ),
                            );

                            if (confirm == true) {
                              await _productService.deleteProduct(product.id);
                              _fetchProducts();
                            }
                          },
                        ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => ProductAddScreen()),
          );
        },
        tooltip: 'Agregar producto',
        child: const Icon(Icons.add),
      ),
    );
  }
}
