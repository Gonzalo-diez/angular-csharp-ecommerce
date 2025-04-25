import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/auth/auth_service.dart';

class CustomSidebar extends StatefulWidget {
  const CustomSidebar({super.key});

  @override
  State<CustomSidebar> createState() => _CustomSidebarState();
}

class _CustomSidebarState extends State<CustomSidebar> {
  Map<String, dynamic>? userData;

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    final auth = Provider.of<AuthService>(context, listen: false);
    if (auth.isAuthenticated && auth.userId != null) {
      final data = await auth.getUserById(auth.userId!);
      if (mounted) {
        setState(() {
          userData = data;
        });
      }
    }
  }

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
          DrawerHeader(
            decoration: const BoxDecoration(color: Colors.blue),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Si está logueado y tiene imagen, mostrarla
                if (auth.isAuthenticated)
                  CircleAvatar(
                    radius: 30,
                    backgroundImage:
                        userData != null
                            ? NetworkImage(
                              'http://192.168.1.6:5180${userData!['imageAvatar']}',
                            )
                            : const AssetImage('assets/default_avatar.png')
                                as ImageProvider,
                  )
                else
                  const CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, size: 30),
                  ),
                const SizedBox(height: 10),
                Text(
                  auth.isAuthenticated
                      ? '${userData?['firstName'] ?? ''} ${userData?['lastName'] ?? ''}'
                      : 'Invitado',
                  style: const TextStyle(color: Colors.white, fontSize: 18),
                ),
              ],
            ),
          ),
          if (auth.isUser)
            ListTile(
              leading: const Icon(Icons.verified_user_sharp),
              title: const Text('Premium'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/upgrade');
              },
            ),
          // Login / Logout
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
