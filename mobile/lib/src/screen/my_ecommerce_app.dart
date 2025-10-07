import 'package:flutter/material.dart';

import 'package:my_commerce/src/screen/home_screen.dart';

class MyEcommerceApp extends StatelessWidget {
  const MyEcommerceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'My Ecommerce',
      home: HomeScreen(),
    );
  }
}
