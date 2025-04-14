import 'package:flutter/material.dart';
import 'package:mobile/widgets/custom_navbar.dart';
import 'package:mobile/widgets/custom_footer.dart';
import 'package:mobile/widgets/custom_sidebar.dart';

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

    return Scaffold(
      drawer: const CustomSidebar(), // 👈 Agregá el sidebar acá
      appBar:
          showSearchBar
              ? CustomNavBar(
                searchController: searchController,
                onSearch: (query) {
                  if (query.trim().isNotEmpty) {
                    Navigator.pushNamed(context, '/search', arguments: query);
                    searchController.clear();
                  }
                },
                onCartPressed: () {
                  Navigator.pushNamed(context, '/cart');
                },
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
