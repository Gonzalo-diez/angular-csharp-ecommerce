import 'checkout_request_model.dart';
import 'invoice_detail_model.dart';
import 'package:mobile/models/auth/auth_model.dart';

class InvoiceModel {
  final int id;
  final int? userId;
  final AuthModel? user;
  final CheckoutRequestModel checkoutRequest;
  final String transactionId;
  final double total;
  final String date;
  final List<InvoiceDetailModel> details;

  InvoiceModel({
    required this.id,
    this.userId,
    this.user,
    required this.checkoutRequest,
    required this.transactionId,
    required this.total,
    required this.date,
    required this.details,
  });

  factory InvoiceModel.fromJson(Map<String, dynamic> json) {
    return InvoiceModel(
      id: json['id'],
      userId: json['userId'],
      user: json['user'] != null ? AuthModel.fromJson(json['user']) : null,
      checkoutRequest: CheckoutRequestModel.fromJson(json['checkoutRequest']),
      transactionId: json['transactionId'],
      total: (json['total'] as num).toDouble(),
      date: json['date'],
      details:
          (json['details'] as List)
              .map((e) => InvoiceDetailModel.fromJson(e))
              .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      if (userId != null) 'userId': userId,
      if (user != null) 'user': user!.toJson(),
      'checkoutRequest': checkoutRequest.toJson(),
      'transactionId': transactionId,
      'total': total,
      'date': date,
      'details': details.map((e) => e.toJson()).toList(),
    };
  }
}
