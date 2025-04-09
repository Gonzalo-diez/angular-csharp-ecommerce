import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'custom_navbar.dart';
import 'custom_footer.dart';

class MainLayout extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final Function(int) onTap;
  final bool showSearchBar;

  const MainLayout({
    super.key,
    required this.child,
    required this.currentIndex,
    required this.onTap,
    this.showSearchBar = true,
  });

  @override
  Widget build(BuildContext context) {
    final searchController = TextEditingController();
    final logger = Logger();

    return Scaffold(
      appBar: showSearchBar
          ? CustomNavBar(
              searchController: searchController,
              onSearch: (query) => logger.i('🔍 Buscar: $query'),
              onCartPressed: () => logger.i('🛒 Ir al carrito'),
            )
          : null,
      body: child,
      bottomNavigationBar: CustomFooter(
        currentIndex: currentIndex,
        onTap: onTap,
      ),
    );
  }
}
