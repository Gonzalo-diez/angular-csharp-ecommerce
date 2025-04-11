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
  final String fullName;
  final String address;
  final String city;
  final String zipCode;
  final String phone;

  ShippingData({
    required this.fullName,
    required this.address,
    required this.city,
    required this.zipCode,
    required this.phone,
  });

  factory ShippingData.fromJson(Map<String, dynamic> json) {
    return ShippingData(
      fullName: json['fullName'],
      address: json['address'],
      city: json['city'],
      zipCode: json['zipCode'],
      phone: json['phone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'address': address,
      'city': city,
      'zipCode': zipCode,
      'phone': phone,
    };
  }
}
