import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/models/dashboard/dashboard_model.dart';

class DashboardService with ChangeNotifier {
  static const String _baseUrl = 'http://192.168.1.6:5180/api/dashboard';
  final Logger _logger = Logger();

  Future<DashboardModel?> getDashboardData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) {
        _logger.w('⚠️ No token found in SharedPreferences.');
        return null;
      }

      _logger.i('Fetching dashboard data from $_baseUrl');

      final response = await http.get(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      _logger.d('Response status: ${response.statusCode}');
      _logger.d('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        final dashboard = DashboardModel.fromJson(jsonData);
        _logger.i('✅ Dashboard data parsed successfully');
        _logger.t(dashboard.toString());
        return dashboard;
      } else {
        _logger.e(
          '❌ Failed to fetch dashboard data - Status code: ${response.statusCode}',
        );
        return null;
      }
    } catch (e, stackTrace) {
      _logger.e(
        '❌ Exception while fetching dashboard data',
        error: e,
        stackTrace: stackTrace,
      );
      return null;
    }
  }
}
