import 'package:flutter/material.dart';
import 'custom_navbar.dart';
import 'custom_footer.dart';

class MainLayout extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final Function(int) onTap;

  const MainLayout({
    super.key,
    required this.child,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final searchController = TextEditingController();

    return Scaffold(
      appBar: CustomNavBar(
        searchController: searchController,
        onSearch: (query) => print('🔍 Buscar: $query'),
        onCartPressed: () => print('🛒 Ir al carrito'),
      ),
      body: child,
      bottomNavigationBar: CustomFooter(
        currentIndex: currentIndex,
        onTap: onTap,
      ),
    );
  }
}
