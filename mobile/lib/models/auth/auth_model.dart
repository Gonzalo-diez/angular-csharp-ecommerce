import 'auth_role.dart';

class AuthModel {
  final int id;
  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final AuthRole role;
  final dynamic products; // o List<Product>? si los modelás después
  final dynamic purchases; // o List<Purchase>? si los modelás después

  AuthModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.role,
    this.products,
    this.purchases,
  });

  factory AuthModel.fromJson(Map<String, dynamic> json) => AuthModel(
    id: json['id'] ?? json['Id'],
    firstName: json['firstName'] ?? json['FirstName'],
    lastName: json['lastName'] ?? json['LastName'],
    email: json['email'] ?? json['Email'],
    password: json['password'] ?? '', // porque no viene en el token
    role:
        json['role'] != null
            ? AuthRole.values.firstWhere((r) => r.name == json['role'])
            : authRoleMap[json['Role']]!,
    products: json['products'],
    purchases: json['purchases'],
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
  };
}
