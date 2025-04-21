import 'package:flutter/material.dart';
import 'package:mobile/screens/cart/shipping-form/shipping_form_screen.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/auth/auth_service.dart';
import 'package:mobile/widgets/main_layout.dart';
import 'package:mobile/models/product/product_model.dart';
import 'package:mobile/screens/product/product-add/product_add_screen.dart';
import 'package:mobile/screens/product/product-subcategory/product_subcategory_screen.dart';
import 'package:mobile/screens/product/product-list/product_list_screen.dart';
import 'package:mobile/screens/auth/login_screen.dart';
import 'package:mobile/screens/product/product-search/product_search_screen.dart';
import 'package:mobile/screens/auth/register_screen.dart';
import 'package:mobile/screens/dashboard/dashboard_screen.dart';
import 'package:mobile/screens/cart/cart_screen.dart';
import 'package:mobile/screens/product/product-category/product_category_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(create: (_) => AuthService(), child: const MyApp()),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final isAuthenticated = authService.isAuthenticated;

    final screens = [const ProductListScreen(), const LoginScreen()];

    final showSearchBar = _currentIndex == 0; // solo en productos

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Tienda de Productos',
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      routes: {
        '/':
            (context) => MainLayout(
              currentIndex: _currentIndex,
              onTap: (index) {
                setState(() => _currentIndex = index);
              },
              showSearchBar: showSearchBar,
              child:
                  isAuthenticated
                      ? screens[_currentIndex]
                      : const LoginScreen(),
            ),
        '/auth/login': (context) => const LoginScreen(),
        '/auth/register': (context) => const RegisterScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/cart': (context) => const CartScreen(),
        '/checkout': (context) => const ShippingFormScreen(),
        '/category': (context) {
          final args =
              ModalRoute.of(context)!.settings.arguments as Map<String, String>;

          // Convertir el String a enum ProductCategory
          final categoryString = args['category']!;
          final category = ProductCategory.values.firstWhere(
            (e) => e.name.toLowerCase() == categoryString.toLowerCase(),
            orElse: () => ProductCategory.technology,
          );

          return ProductCategoryScreen(category: category);
        },
        '/subcategory': (context) {
          final args = ModalRoute.of(context)!.settings.arguments as Map<String, String>;
          final categoryString = args['category']!;
          final category = ProductCategory.values.firstWhere(
            (e) => e.name.toLowerCase() == categoryString.toLowerCase(),
            orElse: () => ProductCategory.technology, // valor por defecto
          );
          final subcategoryString = args['subcategory']!;
          final subcategory = ProductSubCategory.values.firstWhere(
            (e) => e.name.toLowerCase() == subcategoryString.toLowerCase(), 
            orElse: () => ProductSubCategory.console
          );

          return ProductSubcategoryScreen(category: category, subCategory: subcategory);
        },
        '/add': (context) => const ProductAddScreen(),
        '/home':
            (context) => MainLayout(
              currentIndex: 0,
              onTap: (index) {
                setState(() => _currentIndex = index);
              },
              showSearchBar: true,
              child: const ProductListScreen(),
            ),
        '/search': (context) {
          final query = ModalRoute.of(context)?.settings.arguments as String;
          return ProductSearchScreen(query: query);
        },
      },
      initialRoute: '/',
    );
  }
}