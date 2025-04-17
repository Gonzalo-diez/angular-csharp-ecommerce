class CheckoutRequestModel {
  final int? id;
  final String paymentMethod;
  final ShippingData shippingData;

  CheckoutRequestModel({
    this.id,
    required this.paymentMethod,
    required this.shippingData,
  });

  factory CheckoutRequestModel.fromJson(Map<String, dynamic> json) {
    return CheckoutRequestModel(
      id: json['id'],
      paymentMethod: json['paymentMethod'],
      shippingData: ShippingData.fromJson(json['shippingData']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'paymentMethod': paymentMethod,
      'shippingData': shippingData.toJson(),
    };
  }
}

class ShippingData {
  final String cardNumber;
  final String securityCode;
  final DateTime expirationDate;
  final String fullName;
  final String city;
  final String address;
  final String zipCode;
  final String phone;

  ShippingData({
    required this.cardNumber,
    required this.securityCode,
    required this.expirationDate,
    required this.fullName,
    required this.city,
    required this.address,
    required this.zipCode,
    required this.phone,
  });

  factory ShippingData.fromJson(Map<String, dynamic> json) {
    return ShippingData(
      cardNumber: json['cardNumber'],
      securityCode: json['securityCode'],
      expirationDate: DateTime.parse(json['expirationDate']),
      fullName: json['fullName'],
      address: json['address'],
      city: json['city'],
      zipCode: json['zipCode'],
      phone: json['phone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'cardNumber': cardNumber,
      'securityCode': securityCode,
      'expirationDate': expirationDate.toIso8601String(),
      'fullName': fullName,
      'city': city,
      'address': address,
      'zipCode': zipCode,
      'phone': phone,
    };
  }
}
