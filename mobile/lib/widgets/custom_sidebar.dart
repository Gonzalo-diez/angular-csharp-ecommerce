import 'package:flutter/material.dart';

class CustomSidebar extends StatelessWidget {
  const CustomSidebar({super.key});

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
        const Divider(), // Opcional: separador entre categorías
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
            child: Text('Categorías', style: TextStyle(color: Colors.white, fontSize: 20)),
          ),
          _buildCategoryWithSubcategories(context, 'Technology', ['Smartphone', 'PC', 'Console']),
          _buildCategoryWithSubcategories(context, 'Clothing', ['Shirts', 'Pants', 'Shoes']),
          _buildCategoryWithSubcategories(context, 'Home', ['Kitchen', 'Living Room', 'Bedroom']),
        ],
      ),
    );
  }
}

