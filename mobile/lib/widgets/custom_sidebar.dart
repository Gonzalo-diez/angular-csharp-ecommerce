import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/auth/auth_service.dart';

class CustomSidebar extends StatelessWidget {
  const CustomSidebar({super.key});

  // Widget para categoría y subcategorías
  Widget _buildCategoryWithSubcategories(
    BuildContext context,
    String category,
    List<String> subcategories,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ListTile(
          title: Text(category),
          onTap: () {
            Navigator.pop(context);
            Navigator.pushNamed(
              context,
              '/category',
              arguments: {
                'category': category.toLowerCase(),
                'subcategory': '',
              },
            );
          },
        ),
        ...subcategories.map((sub) {
          return Padding(
            padding: const EdgeInsets.only(left: 20.0),
            child: ListTile(
              title: Text(sub),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(
                  context,
                  '/subcategory',
                  arguments: {
                    'category': category.toLowerCase(),
                    'subcategory': sub.toLowerCase(),
                  },
                );
              },
            ),
          );
        }),
        const Divider(),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text(
              'Menú',
              style: TextStyle(color: Colors.white, fontSize: 20),
            ),
          ),

          // Login / Logout arriba
          ListTile(
            leading: Icon(auth.isAuthenticated ? Icons.logout : Icons.login),
            title: Text(
              auth.isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión',
            ),
            onTap: () async {
              Navigator.pop(context);
              if (auth.isAuthenticated) {
                await auth.logout();
                if (context.mounted) {
                  Navigator.pushReplacementNamed(context, '/auth/login');
                }
              } else {
                Navigator.pushNamed(context, '/auth/login');
              }
            },
          ),

          const Divider(),

          // Categorías y subcategorías
          _buildCategoryWithSubcategories(context, 'Technology', [
            'Smartphone',
            'PC',
            'Console',
          ]),
          _buildCategoryWithSubcategories(context, 'Clothing', [
            'Shirts',
            'Pants',
            'Shoes',
          ]),
          _buildCategoryWithSubcategories(context, 'Home', [
            'Kitchen',
            'Living Room',
            'Bedroom',
          ]),
        ],
      ),
    );
  }
}
