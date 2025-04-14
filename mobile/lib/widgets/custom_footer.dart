import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/services/auth/auth_service.dart';

class CustomFooter extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomFooter({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Builder(
      builder:
          (context) => BottomNavigationBar(
            currentIndex: currentIndex,
            onTap: (index) async {
              if (index == 2) {
                Scaffold.of(context).openDrawer();
              } else if (auth.isAuthenticated && index == 1) {
                await auth.logout();
                if (context.mounted) {
                  Navigator.pushReplacementNamed(context, '/auth/login');
                }
              } else {
                onTap(index);
              }
            },
            items: [
              const BottomNavigationBarItem(
                icon: Icon(Icons.home),
                label: 'Inicio',
              ),
              BottomNavigationBarItem(
                icon: Icon(auth.isAuthenticated ? Icons.logout : Icons.person),
                label: auth.isAuthenticated ? 'Logout' : 'Login',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.menu),
                label: 'Más',
              ),
            ],
          ),
    );
  }
}
