import 'package:flutter/material.dart';
import 'widgets/main_layout.dart';
import 'screens/products/product-list/product_list_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const ProductListScreen(),
    const Center(child: Text('Login Screen')), // Podés reemplazar esto
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tienda de Productos',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      home: MainLayout(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        child: _screens[_currentIndex],
      ),
    );
  }
}
