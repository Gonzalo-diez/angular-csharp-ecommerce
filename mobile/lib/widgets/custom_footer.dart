import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth/auth_service.dart';

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

    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: (index) async {
        if (auth.isAuthenticated && index == 1) {
          // El usuario tocó "Logout"
          await auth.logout();

          // Navegar a pantalla de login (ajustá el route según tu app)
          if (context.mounted) {
            Navigator.pushReplacementNamed(context, '/auth/login');
          }
        } else {
          onTap(index); // Usar la lógica normal del tap
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
      ],
    );
  }
}
