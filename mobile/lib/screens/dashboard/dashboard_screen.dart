import 'package:flutter/material.dart';
import 'package:mobile/services/dashboard/dashboard_service.dart';
import 'package:mobile/models/dashboard/dashboard_model.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final DashboardService _dashboardService = DashboardService();
  DashboardModel? _dashboardData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDashboard();
  }

  Future<void> _fetchDashboard() async {
    final data = await _dashboardService.getDashboardData();
    setState(() {
      _dashboardData = data;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _dashboardData == null
              ? const Center(child: Text('No se pudo cargar el dashboard'))
              : SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSummaryCards(),
                    const SizedBox(height: 20),
                    _buildUserList(),
                    const SizedBox(height: 20),
                    _buildProductList(),
                    const SizedBox(height: 20),
                    _buildCategorySales(),
                    const SizedBox(height: 20),
                    _buildSubcategorySales(),
                  ],
                ),
              ),
    );
  }

  Widget _buildSummaryCards() {
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: [
        _infoCard('Usuarios', _dashboardData!.totalUsers.toString()),
        _infoCard('Productos', _dashboardData!.totalProducts.toString()),
        _infoCard('Compras', _dashboardData!.totalPurchases.toString()),
        _infoCard(
          'Ingresos',
          '\$${_dashboardData!.totalRevenue.toStringAsFixed(2)}',
        ),
      ],
    );
  }

  Widget _infoCard(String title, String value) {
    return Card(
      elevation: 3,
      child: Container(
        width: 160,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }

  Widget _buildUserList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Usuarios recientes',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ..._dashboardData!.users
            .take(5)
            .map((u) => ListTile(title: Text(u.name), subtitle: Text(u.email))),
      ],
    );
  }

  Widget _buildProductList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Productos destacados',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ..._dashboardData!.products
            .take(5)
            .map(
              (p) => ListTile(
                title: Text(p.name),
                subtitle: Text('Categoría: ${p.category.name}'),
                trailing: Text('\$${p.price.toStringAsFixed(2)}'),
              ),
            ),
      ],
    );
  }

  Widget _buildCategorySales() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Ventas por categoría',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ..._dashboardData!.categorySales.map(
          (c) => ListTile(
            title: Text(c.category.name),
            subtitle: Text('Vendidos: ${c.totalSold}'),
            trailing: Text('${c.percentageSold.toStringAsFixed(1)}%'),
          ),
        ),
      ],
    );
  }

  Widget _buildSubcategorySales() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Ventas por subcategoría',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ..._dashboardData!.subcategorySales.map(
          (s) => ListTile(
            title: Text('${s.category.name} > ${s.subCategory.name}'),
            subtitle: Text('Vendidos: ${s.totalSold}'),
            trailing: Text('${s.percentageSold.toStringAsFixed(1)}%'),
          ),
        ),
      ],
    );
  }
}
