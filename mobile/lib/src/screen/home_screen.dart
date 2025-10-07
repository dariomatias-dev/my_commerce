import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

const _technologies = <String>[
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Docker",
  "Flutter",
];

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Não foi possível abrir $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                const SizedBox(height: 48.0),
                Text(
                  'Sistema SaaS de Lojas Virtuais',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16.0),
                Text(
                  'Uma solução SaaS completa e escalável para pequenos empreendedores criarem e gerenciarem suas lojas virtuais.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 48.0),
                Wrap(
                  spacing: 16.0,
                  runSpacing: 16.0,
                  alignment: WrapAlignment.center,
                  children: <Widget>[
                    ElevatedButton(
                      onPressed: () => _launchUrl(
                        'https://github.com/dariomatias-dev/my_commerce/',
                      ),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24.0,
                          vertical: 12.0,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30.0),
                        ),
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Theme.of(
                          context,
                        ).colorScheme.onPrimary,
                      ),
                      child: const Text(
                        'Explore a documentação',
                        style: TextStyle(fontSize: 16.0),
                      ),
                    ),
                    OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24.0,
                          vertical: 12.0,
                        ),
                        side: BorderSide(
                          color: Theme.of(context).colorScheme.outline,
                          width: 1.0,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30.0),
                        ),
                        foregroundColor: Theme.of(
                          context,
                        ).colorScheme.onSurface,
                      ),
                      child: const Text(
                        'Ver Demo',
                        style: TextStyle(fontSize: 16.0),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 64.0),
                Text(
                  'Contruído com',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 24.0),
                Wrap(
                  spacing: 8.0,
                  runSpacing: 8.0,
                  alignment: WrapAlignment.center,
                  children: _technologies.map((tech) {
                    return Chip(
                      label: Text(tech),
                      labelStyle: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface,
                        fontSize: 14.0,
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10.0,
                        vertical: 6.0,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20.0),
                        side: BorderSide(color: Colors.grey.shade400),
                      ),
                      elevation: 1.0,
                    );
                  }).toList(),
                ),
                const SizedBox(height: 64.0),
                Text(
                  '© ${DateTime.now().year} Dário Matias. Todos os direitos reservados.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 24.0),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
