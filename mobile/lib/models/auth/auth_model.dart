import 'package:mobile/models/auth/auth_role.dart';

class AuthModel {
  final int id;
  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final AuthRole role;
  final dynamic products;
  final dynamic purchases;
  final String? imageAvatar;

  AuthModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.role,
    this.products,
    this.purchases,
    this.imageAvatar,
  });

  factory AuthModel.fromJson(Map<String, dynamic> json) => AuthModel(
    id: json['id'] ?? json['Id'],
    firstName: json['firstName'] ?? json['FirstName'],
    lastName: json['lastName'] ?? json['LastName'],
    email: json['email'] ?? json['Email'],
    password: json['password'] ?? '',
    role: json['role'] != null
    ? AuthRole.values.firstWhere(
        (r) => r.name == json['role'],
        orElse: () => AuthRole.user,
      )
    : authRoleMap[json['Role']] ?? AuthRole.user,
    products: json['products'],
    purchases: json['purchases'],
    imageAvatar: json['imageAvatar']?.toString(),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'firstName': firstName,
    'lastName': lastName,
    'email': email,
    'password': password,
    'role': role.name,
    'products': products,
    'purchases': purchases,
    'imageAvatar': imageAvatar,
  };
}
