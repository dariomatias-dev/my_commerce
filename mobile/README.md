<br>
<div align="center">
  <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter">
  <img src="https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white" alt="Dart">
  <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android">
  <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white" alt="iOS">
</div>
<br>

<h1 align="center">Sistema SaaS de Lojas Virtuais – Aplicativo Mobile</h1>

<p align="center">
  O aplicativo mobile desenvolvido para o cliente final, permitindo navegar, pesquisar e gerenciar pedidos das lojas virtuais.
  <br>
  <a href="#sobre-o-projeto"><strong>Explore a documentação »</strong></a>
  <br>
  <br>
  <a href="https://github.com/dariomatias-dev/my_commerce">Repositório Principal</a> · 
  <a href="https://github.com/dariomatias-dev/my_commerce/issues">Reportar Bug</a> · 
  <a href="https://github.com/dariomatias-dev/my_commerce/issues">Solicitar Recurso</a>
</p>

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Construído com](#construído-com)
- [Como Começar](#como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executar o Projeto](#executar-o-projeto)
  - [Criação e Instalação do APK via Terminal](#criação-e-instalação-do-apk-via-terminal)
- [Licença](#licença)
- [Autor](#autor)

## Sobre o Projeto

Este repositório contém o código-fonte do aplicativo mobile do **Sistema SaaS de Lojas Virtuais**.  
Desenvolvido com **Flutter** e **Dart**, o aplicativo oferece uma experiência intuitiva e nativa para o cliente final, permitindo que eles naveguem pelas lojas criadas na plataforma, pesquisem produtos, gerenciem favoritos e acompanhem pedidos.

O aplicativo complementa a plataforma web, expandindo o alcance das lojas virtuais para o ambiente mobile, proporcionando conveniência e praticidade aos consumidores para interagirem com suas lojas favoritas em qualquer lugar.

## Funcionalidades

- **Navegação por Lojas e Produtos**: Explore lojas e seus catálogos de produtos.
- **Pesquisa e Filtros**: Encontre produtos específicos com pesquisa textual e filtros por categorias.
- **Lista de Favoritos**: Salve produtos de interesse para acesso rápido.
- **Histórico de Pedidos**: Consulte o histórico de compras realizadas.
- **Notificações**: Receba alertas sobre promoções, novidades e reposição de estoque.
- **Experiência Nativa**: Design e performance otimizados para Android e iOS.
- **Integração com API**: Comunicação direta com o backend para consumir dados de lojas e produtos.

## Construído com

- **[Flutter](https://flutter.dev/)** – Toolkit de UI do Google para criar aplicativos nativos multiplataforma.
- **[Dart](https://dart.dev/)** – Linguagem de programação otimizada para performance e produtividade no Flutter.

## Como Começar

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Flutter SDK** (versão estável mais recente)
- **Android Studio** ou **VS Code** com plugins Flutter
- Um **emulador** Android/iOS ou dispositivo físico configurado

### Instalação

1. **Clonar o repositório principal**

   ```bash
   git clone https://github.com/dariomatias-dev/my_commerce.git

   cd my_commerce
   ```

2. **Entrar na pasta do aplicativo mobile**

   ```bash
   cd mobile
   ```

3. **Instalar dependências**

   ```bash
   flutter pub get
   ```

### Executar o Projeto

Para rodar o aplicativo em um emulador ou dispositivo conectado:

```bash
flutter run
```

Certifique-se de que o backend esteja rodando para que o aplicativo possa se comunicar corretamente.

### Criação e Instalação do APK via Terminal

Siga os passos abaixo para gerar o **APK** do aplicativo e instalá-lo em um dispositivo ou emulador Android.

#### Gerando o APK

No Flutter, você pode gerar o APK em **modo release** ou **modo debug**.

##### APK de Release

Para gerar o APK de **release**, otimizado para distribuição:

```bash
flutter build apk --release
```

O APK será gerado em:

```
build/app/outputs/flutter-apk/app-release.apk
```

##### APK de Debug

Para gerar o APK de **debug**, usado para testes rápidos:

```bash
flutter build apk --debug
```

O APK será gerado em:

```
build/app/outputs/flutter-apk/app-debug.apk
```

#### Instalando o APK no Dispositivo

##### Usando Flutter

1. Verifique se o dispositivo está conectado:

```bash
flutter devices
```

2. Instale o APK:

```bash
flutter install
```

Observação: O comando `flutter install` instala a versão mais recente do APK no dispositivo conectado.

##### Usando ADB

Se preferir usar o **ADB** diretamente:

```bash
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

* O parâmetro `-r` reinstala o APK caso uma versão anterior já exista.
* Para instalar o APK de debug, substitua pelo `app-debug.apk`.

#### Executando o Aplicativo

Após a instalação, abra o aplicativo normalmente ou execute pelo terminal:

```bash
flutter run --release
```

Para testes em modo debug:

```bash
flutter run --debug
```

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](../LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfolio**: [dariomatias-dev](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
