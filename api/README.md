<div align="center">
<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java">
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</div>
<br>

<h1 align="center">Sistema SaaS de Lojas Virtuais – Backend</h1>

<p align="center">
   A API RESTful para o Sistema SaaS de Lojas Virtuais, construída com Spring Boot e Java, com PostgreSQL e Docker.
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
- [Contruído com](#contruído-com)
- [Como Começar](#como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração do Banco de Dados com Docker](#configuração-do-banco-de-dados-com-docker)
  - [Rodando o Projeto](#rodando-o-projeto)
- [Licença](#licença)
- [Autor](#autor)

## Sobre o Projeto

Este repositório contém o código-fonte do backend do Sistema SaaS de Lojas Virtuais. Desenvolvida como uma API RESTful utilizando Spring Boot e Java, esta parte do sistema é responsável por toda a lógica de negócio, persistência de dados e comunicação entre o frontend web, o aplicativo mobile e o banco de dados.

O backend gerencia autenticação, controle de acesso, gestão de usuários e assinaturas, operações CRUD para lojas e produtos, processamento de pedidos e geração de relatórios. Ele foi projetado para ser robusto, escalável e seguro, garantindo a integridade e a disponibilidade das informações da plataforma.

## Funcionalidades

As principais funcionalidades expostas por esta API incluem:

- **Gestão de Usuários e Assinaturas**: CRUD completo para usuários e controle de seus respectivos planos de assinatura (Gratuito, Pro, Business).
- **Autenticação e Autorização**: Mecanismos de segurança para garantir acesso restrito a endpoints com base em perfis (User, Subscriber, Admin).
- **Gestão de Lojas Virtuais**: Operações para criar, ler, atualizar e excluir lojas, incluindo configuração de dados básicos e personalização.
- **Gestão de Produtos e Categorias**: APIs para gerenciar o catálogo de produtos de cada loja, incluindo nome, descrição, preço, estoque, status e imagens.
- **Processamento de Pedidos**: Funcionalidades para criar, acompanhar e gerenciar o ciclo de vida dos pedidos feitos pelos clientes finais.
- **Controle de Envio e Logística**: Gerenciamento de endereços, frete e prazos de entrega.
- **Relatórios e Métricas**: Geração de dados para dashboards e relatórios gerenciais sobre vendas, engajamento, assinantes ativos e produtos populares.
- **Moderação de Conteúdo**: Ferramentas para administradores moderarem lojas e produtos.

## Contruído com

Este projeto foi desenvolvido utilizando as seguintes tecnologias e bibliotecas:

- **[Java](https://www.java.com/)** – Linguagem de programação amplamente usada para desenvolvimento de sistemas robustos e de alta performance.
- **[Spring Boot](https://spring.io/projects/spring-boot/)** – Framework Java para desenvolvimento rápido de APIs RESTful robustas, escaláveis, seguras e de fácil manutenção.
- **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional poderoso, de código aberto e confiável, utilizado para armazenamento de dados da aplicação.
- **[Docker](https://www.docker.com/)** – Plataforma de conteinerização para empacotar a aplicação e suas dependências, garantindo ambientes padronizados e deploy simplificado.

## Como Começar

Para ter uma cópia local funcionando do backend, siga os passos abaixo.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- **Java Development Kit (JDK)**: Versão 17 ou superior.
- **Maven**: Para gerenciamento de dependências e build do projeto Java.
- **Docker** e **Docker Compose**: Para a conteinerização do banco de dados PostgreSQL.

### Instalação

1. **Clonar o Repositório Principal**

   Se você ainda não o fez, clone o repositório geral do projeto:

   ```bash
   git clone https://github.com/dariomatias-dev/my_commerce.git

   cd my_commerce
   ```

2. **Navegar até o Diretório do Backend**

   Entre na pasta `api` do projeto:

   ```bash
   cd api
   ```

### Configuração do Banco de Dados com Docker

O banco de dados PostgreSQL é configurado e executado através do Docker Compose.

1. **Crie um arquivo `.env`**

   Acesse o arquivo `.env-example` e remova `-example`.
   Altere os valores conforme necessário.

2. Inicie o Contêiner do Banco de Dados

Para criar e iniciar o contêiner do PostgreSQL usando o Docker Compose, siga as instruções conforme o seu sistema operacional:

- **Windows**
  Abra o terminal ou PowerShell e execute:

  ```bash
  docker-compose up -d
  ```

- **Linux**
  Abra o terminal e execute:

  ```bash
  docker compose up -d
  ```

**Observação:** O parâmetro `-d` executa o contêiner em **segundo plano**, permitindo que você continue usando o terminal normalmente.

### Rodando o Projeto

1. **Compile e Execute a Aplicação Spring Boot**

   Certifique-se de que o contêiner do banco de dados esteja em execução. Em seguida, na pasta `api`, use Maven para compilar e iniciar a aplicação Spring Boot:

   ```bash
   ./mvnw clean install

   ./mvnw spring-boot:run
   ```

   A aplicação estará disponível em `http://localhost:8080` (porta padrão do Spring Boot, a menos que configurado de outra forma).

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](../LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfolio**: [dariomatias-dev](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
