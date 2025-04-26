import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/auth/auth_service.dart';

class UpgradeRoleScreen extends StatefulWidget {
  const UpgradeRoleScreen({super.key});

  @override
  State<UpgradeRoleScreen> createState() => _UpgradeRoleScreenState();
}

class _UpgradeRoleScreenState extends State<UpgradeRoleScreen> {
  final _formKey = GlobalKey<FormState>();
  String _paymentMethod = 'stripe';
  String _cardNumber = '';
  String _securityNumber = '';
  bool _loading = false;

  Future<void> _submitUpgrade() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    final authService = Provider.of<AuthService>(context, listen: false);

    setState(() {
      _loading = true;
    });

    final success = await authService.upgradeRole(
      paymentMethod: _paymentMethod,
      cardNumber: _cardNumber,
      securityNumber: int.parse(_securityNumber),
    );

    if (!mounted) return;

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            success
                ? '✅ Upgrade exitoso, ya eres Premium!'
                : '❌ Error al actualizar el rol.',
          ),
        ),
      );
      if (success) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    }

    setState(() {
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Upgrade a Premium')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child:
            auth.isAuthenticated
                ? Form(
                  key: _formKey,
                  child: ListView(
                    children: [
                      DropdownButtonFormField<String>(
                        value: _paymentMethod,
                        items: const [
                          DropdownMenuItem(
                            value: 'stripe',
                            child: Text('Stripe'),
                          ),
                          DropdownMenuItem(
                            value: 'mercadopago',
                            child: Text('MercadoPago'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _paymentMethod = value!;
                          });
                        },
                        decoration: const InputDecoration(
                          labelText: 'Método de pago',
                        ),
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Número de tarjeta',
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null ||
                              value.isEmpty ||
                              value.length != 16) {
                            return 'Ingresa un número de tarjeta válido (16 dígitos)';
                          }
                          return null;
                        },
                        onSaved: (value) => _cardNumber = value!,
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Número de seguridad',
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null ||
                              value.isEmpty ||
                              value.length < 3 ||
                              value.length > 4) {
                            return 'Ingresa un número de seguridad válido (3-4 dígitos)';
                          }
                          return null;
                        },
                        onSaved: (value) => _securityNumber = value!,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loading ? null : _submitUpgrade,
                        child:
                            _loading
                                ? const CircularProgressIndicator()
                                : const Text('Actualizar a Premium'),
                      ),
                    ],
                  ),
                )
                : const Center(child: Text('Debes iniciar sesión')),
      ),
    );
  }
}
