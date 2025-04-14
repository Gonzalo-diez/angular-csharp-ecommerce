import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/models/product/product_model.dart';
import 'package:mobile/services/product/product_service.dart';

class ProductUpdateScreen extends StatefulWidget {
  final ProductModel product;
  final int productId;

  const ProductUpdateScreen({super.key, required this.product, required this.productId});

  @override
  State<ProductUpdateScreen> createState() => _ProductUpdateScreenState();
}

class _ProductUpdateScreenState extends State<ProductUpdateScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _brandController;
  late TextEditingController _priceController;
  late TextEditingController _stockController;
  ProductCategory? _selectedCategory;
  ProductSubCategory? _selectedSubCategory;
  ProductStatus? _selectedStatus;
  File? _selectedImage;

  final ProductService _productService = ProductService();

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.product.name);
    _brandController = TextEditingController(text: widget.product.brand);
    _priceController = TextEditingController(text: widget.product.price.toString());
    _stockController = TextEditingController(text: widget.product.stock.toString());
    _selectedCategory = widget.product.category;
    _selectedSubCategory = widget.product.subCategory;
    _selectedStatus = widget.product.status;
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() {
        _selectedImage = File(picked.path);
      });
    }
  }

  Future<void> _updateProduct() async {
    if (!_formKey.currentState!.validate()) return;

    final productData = {
      'name': _nameController.text,
      'brand': _brandController.text,
      'price': double.parse(_priceController.text),
      'stock': int.parse(_stockController.text),
      'category': _selectedCategory!.index,
      'subCategory': _selectedSubCategory!.index,
      'status': _selectedStatus!.index,
    };

    try {
      final updated = await _productService.updateProduct(
        widget.product.id,
        productData,
        image: _selectedImage,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ Producto actualizado: ${updated.name}')),
      );
      Navigator.pop(context, updated); // Devuelve el producto actualizado
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Error al actualizar: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Actualizar producto')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Nombre'),
                validator: (value) => value!.isEmpty ? 'Campo requerido' : null,
              ),
              TextFormField(
                controller: _brandController,
                decoration: const InputDecoration(labelText: 'Marca'),
              ),
              TextFormField(
                controller: _priceController,
                decoration: const InputDecoration(labelText: 'Precio'),
                keyboardType: TextInputType.number,
              ),
              TextFormField(
                controller: _stockController,
                decoration: const InputDecoration(labelText: 'Stock'),
                keyboardType: TextInputType.number,
              ),
              DropdownButtonFormField<ProductCategory>(
                value: _selectedCategory,
                items: ProductCategory.values
                    .map((cat) => DropdownMenuItem(
                          value: cat,
                          child: Text(cat.name),
                        ))
                    .toList(),
                onChanged: (val) => setState(() => _selectedCategory = val),
                decoration: const InputDecoration(labelText: 'Categoría'),
              ),
              DropdownButtonFormField<ProductSubCategory>(
                value: _selectedSubCategory,
                items: ProductSubCategory.values
                    .map((sub) => DropdownMenuItem(
                          value: sub,
                          child: Text(sub.name),
                        ))
                    .toList(),
                onChanged: (val) => setState(() => _selectedSubCategory = val),
                decoration: const InputDecoration(labelText: 'Subcategoría'),
              ),
              DropdownButtonFormField<ProductStatus>(
                value: _selectedStatus,
                items: ProductStatus.values
                    .map((status) => DropdownMenuItem(
                          value: status,
                          child: Text(status.name),
                        ))
                    .toList(),
                onChanged: (val) => setState(() => _selectedStatus = val),
                decoration: const InputDecoration(labelText: 'Estado'),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _pickImage,
                icon: const Icon(Icons.image),
                label: const Text('Seleccionar imagen'),
              ),
              if (_selectedImage != null)
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Image.file(_selectedImage!, height: 150),
                ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _updateProduct,
                child: const Text('Guardar cambios'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
