import 'package:flutter/material.dart';
import 'package:mobile/screens/auth/register_screen.dart';
import 'package:provider/provider.dart';
import 'services/auth/auth_service.dart';
import 'widgets/main_layout.dart';
import 'screens/product/product-list/product_list_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/product/product-search/product_search_screen.dart';

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
