import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/models/product/product_model.dart';
import 'package:mobile/services/product/product_service.dart';

class ProductAddScreen extends StatefulWidget {
  const ProductAddScreen({super.key});

  @override
  State<ProductAddScreen> createState() => _ProductAddScreenState();
}

class _ProductAddScreenState extends State<ProductAddScreen> {
  final _formKey = GlobalKey<FormState>();
  final _picker = ImagePicker();
  final _productService = ProductService();

  String name = '';
  String brand = '';
  double price = 0;
  int stock = 0;
  ProductCategory category = ProductCategory.technology;
  ProductSubCategory subCategory = ProductSubCategory.pc;
  ProductStatus status = ProductStatus.enable;
  File? image;

  bool isSubmitting = false;

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => image = File(pickedFile.path));
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => isSubmitting = true);

    final product = ProductModel(
      id: 0, // backend should assign ID
      name: name,
      brand: brand,
      price: price,
      stock: stock,
      category: category,
      subCategory: subCategory,
      status: status,
    );

    try {
      final added = await _productService.addProduct(product, image: image);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ Producto agregado: ${added.name}')),
      );
      Navigator.pop(context); // volver atrás
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('❌ Error al agregar producto')));
    } finally {
      setState(() => isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Agregar Producto')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child:
            isSubmitting
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          decoration: const InputDecoration(
                            labelText: 'Nombre',
                          ),
                          validator:
                              (value) => value!.isEmpty ? 'Requerido' : null,
                          onSaved: (value) => name = value!,
                        ),
                        TextFormField(
                          decoration: const InputDecoration(labelText: 'Marca'),
                          validator:
                              (value) => value!.isEmpty ? 'Requerido' : null,
                          onSaved: (value) => brand = value!,
                        ),
                        TextFormField(
                          decoration: const InputDecoration(
                            labelText: 'Precio',
                          ),
                          keyboardType: TextInputType.number,
                          validator:
                              (value) =>
                                  double.tryParse(value!) == null
                                      ? 'Número inválido'
                                      : null,
                          onSaved: (value) => price = double.parse(value!),
                        ),
                        TextFormField(
                          decoration: const InputDecoration(labelText: 'Stock'),
                          keyboardType: TextInputType.number,
                          validator:
                              (value) =>
                                  int.tryParse(value!) == null
                                      ? 'Número inválido'
                                      : null,
                          onSaved: (value) => stock = int.parse(value!),
                        ),
                        DropdownButtonFormField<ProductCategory>(
                          value: category,
                          decoration: const InputDecoration(
                            labelText: 'Categoría',
                          ),
                          items:
                              ProductCategory.values
                                  .map(
                                    (c) => DropdownMenuItem(
                                      value: c,
                                      child: Text(c.name),
                                    ),
                                  )
                                  .toList(),
                          onChanged:
                              (value) => setState(() => category = value!),
                        ),
                        DropdownButtonFormField<ProductSubCategory>(
                          value: subCategory,
                          decoration: const InputDecoration(
                            labelText: 'Subcategoría',
                          ),
                          items:
                              ProductSubCategory.values
                                  .map(
                                    (s) => DropdownMenuItem(
                                      value: s,
                                      child: Text(s.name),
                                    ),
                                  )
                                  .toList(),
                          onChanged:
                              (value) => setState(() => subCategory = value!),
                        ),
                        DropdownButtonFormField<ProductStatus>(
                          value: status,
                          decoration: const InputDecoration(
                            labelText: 'Estado',
                          ),
                          items:
                              ProductStatus.values
                                  .map(
                                    (s) => DropdownMenuItem(
                                      value: s,
                                      child: Text(s.name),
                                    ),
                                  )
                                  .toList(),
                          onChanged: (value) => setState(() => status = value!),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            ElevatedButton.icon(
                              onPressed: _pickImage,
                              icon: const Icon(Icons.image),
                              label: const Text('Seleccionar Imagen'),
                            ),
                            const SizedBox(width: 10),
                            if (image != null)
                              Expanded(
                                child: Text(image!.path.split('/').last),
                              ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _submit,
                          child: const Text('Agregar Producto'),
                        ),
                      ],
                    ),
                  ),
                ),
      ),
    );
  }
}
