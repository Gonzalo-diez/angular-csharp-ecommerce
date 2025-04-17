import 'package:flutter/material.dart';
import 'package:mobile/models/invoice/checkout_request_model.dart';

class ShippingFormScreen extends StatefulWidget {
  const ShippingFormScreen({super.key});

  @override
  State<ShippingFormScreen> createState() => _ShippingFormScreenState();
}

class _ShippingFormScreenState extends State<ShippingFormScreen> {
  final _formKey = GlobalKey<FormState>();

  String cardNumber = '';
  String securityCode = '';
  DateTime? expirationDate;
  String fullName = '';
  String city = '';
  String address = '';
  String zipCode = '';
  String phone = '';
  String paymentMethod = 'MercadoPago';

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      if (expirationDate == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Por favor selecciona la fecha de expiración'),
          ),
        );
        return;
      }

      _formKey.currentState!.save();

      final shippingData = ShippingData(
        cardNumber: cardNumber,
        securityCode: securityCode,
        expirationDate: expirationDate!,
        fullName: fullName,
        city: city,
        address: address,
        zipCode: zipCode,
        phone: phone,
      );

      final checkoutRequest = CheckoutRequestModel(
        paymentMethod: paymentMethod,
        shippingData: shippingData,
      );

      Navigator.pop(context, checkoutRequest);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Datos de envío')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Numero de tarjeta',
                ),
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => cardNumber = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Numero de codigo de seguridad',
                ),
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => securityCode = value!,
              ),
              ListTile(
                title: Text(
                  expirationDate == null
                      ? 'Seleccionar fecha de expiración'
                      : 'Fecha de expiración: ${expirationDate!.month}/${expirationDate!.year}',
                ),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final now = DateTime.now();
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: now,
                    firstDate: now,
                    lastDate: DateTime(now.year + 10),
                  );

                  if (picked != null) {
                    setState(() {
                      expirationDate = picked;
                    });
                  }
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Nombre completo'),
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => fullName = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Ciudad'),
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => city = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Calle / Dirección',
                ),
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => address = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Código postal'),
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => zipCode = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Teléfono'),
                keyboardType: TextInputType.phone,
                validator:
                    (value) =>
                        value!.isEmpty ? 'Este campo es obligatorio' : null,
                onSaved: (value) => phone = value!,
              ),
              const SizedBox(height: 16),
              const Text(
                'Método de pago',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              ListTile(
                title: const Text('MercadoPago'),
                leading: Radio<String>(
                  value: 'MercadoPago',
                  groupValue: paymentMethod,
                  onChanged: (value) {
                    setState(() {
                      paymentMethod = value!;
                    });
                  },
                ),
              ),
              ListTile(
                title: const Text('Stripe'),
                leading: Radio<String>(
                  value: 'Stripe',
                  groupValue: paymentMethod,
                  onChanged: (value) {
                    setState(() {
                      paymentMethod = value!;
                    });
                  },
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _submitForm,
                child: const Text('Confirmar y pagar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
