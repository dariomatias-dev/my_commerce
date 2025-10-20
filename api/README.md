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
- [Rotas da API](#rotas-da-api)
- [Contruído com](#contruído-com)
- [Como Começar](#como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração do Banco de Dados com Docker](#configuração-do-banco-de-dados-com-docker)
  - [Rodando o Projeto](#rodando-o-projeto)
  - [Populando o Banco de Dados](#populando-o-banco-de-dados)
  - [Uso de Repositórios JDBC](#uso-de-repositórios-jdbc)
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

## Rotas da API

Para consultar todos os endpoints da API, incluindo **Autenticação, Usuários, Lojas, Produtos, Pedidos e Relatórios**, veja a documentação das rotas:

- **Documentação de Rotas da API**: [`api-routes.md`](../docs/api-routes/README.md)

Essa documentação contém informações detalhadas sobre cada endpoint, incluindo objetivo, parâmetros de entrada, exemplos de request/response e códigos de status retornados.

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

#### Comandos Úteis do Docker

Após iniciar o contêiner, é importante conhecer alguns comandos básicos para monitorar, gerenciar e manter o ambiente Docker.

##### **Verificar contêineres em execução**

Lista apenas os contêineres **ativos**:

```bash
docker ps
```

##### **Listar todos os contêineres (ativos e parados)**

Lista todos os contêineres existentes, inclusive os que estão parados:

```bash
docker ps -a
```

##### **Parar o contêiner**

Interrompe a execução do contêiner:

```bash
docker stop nome_ou_id_do_conteiner
```

**Exemplo:**

```bash
docker stop my_commerce_db
```

##### **Iniciar o contêiner parado**

Inicia novamente um contêiner que já foi criado anteriormente:

```bash
docker start nome_ou_id_do_conteiner
```

**Exemplo:**

```bash
docker start my_commerce_db
```

##### **Remover o contêiner**

Remove um contêiner existente (deve estar parado):

```bash
docker rm nome_ou_id_do_conteiner
```

**Exemplo:**

```bash
docker rm my_commerce_db
```

##### **Verificar logs do contêiner**

Exibe os logs gerados pelo PostgreSQL, útil para depuração:

```bash
docker logs nome_ou_id_do_conteiner
```

**Exemplo:**

```bash
docker logs my_commerce_db
```

##### **Acessar o terminal do contêiner**

Permite entrar dentro do contêiner e executar comandos diretamente no banco:

```bash
docker exec -it nome_ou_id_do_conteiner bash
```

**Exemplo:**

```bash
docker exec -it my_commerce_db bash
```

Dentro do contêiner, é possível acessar o banco com:

```bash
psql -U nome_do_usuario -d nome_do_banco
```

**Exemplo:**

```bash
psql -U admin -d my_commerce_db
```

##### **Recriar o contêiner**

Se houver alterações no `docker-compose.yml` ou no `.env`, você pode recriar o contêiner:

```bash
docker compose up -d --force-recreate
```

### Rodando o Projeto

1. **Compile e Execute a Aplicação Spring Boot**

   Certifique-se de que o contêiner do banco de dados esteja em execução. Em seguida, na pasta `api`, use Maven para compilar e iniciar a aplicação Spring Boot:

   ```bash
   ./mvnw clean install

   ./mvnw spring-boot:run
   ```

   A aplicação estará disponível em `http://localhost:8080` (porta padrão do Spring Boot, a menos que configurado de outra forma).

### Populando o Banco de Dados

O projeto inclui **scripts de seed** para popular automaticamente o banco de dados com dados iniciais de desenvolvimento e teste.

#### Estrutura das Seeds

As seeds estão localizadas em:

```
api/src/main/java/com/dariomatias/my_commerce/seed
```

Cada **subpasta representa uma tabela**, e contém as classes responsáveis por inserir os registros dessa tabela.
Exemplo:

```
seed/
 └── user/
      ├── RunUserSeed.java
      └── UserSeed.java
```

#### Como Funcionam

Cada seed é executada de forma independente e utiliza o contexto do **Spring Boot**, permitindo acesso a repositórios, serviços e demais componentes configurados no projeto.
O arquivo `Run<ClassName>Seed.java` é responsável por chamar a seed correspondente.

#### Executando uma Seed

1. Certifique-se de que o **banco de dados PostgreSQL** esteja em execução.
2. Navegue até o diretório `api`.
3. Execute a seed desejado com o comando:

   ```bash
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.<nome_da_tabela>.Run<ClassName>Seed"
   ```

   **Exemplo:**

   ```bash
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.user.RunUserSeed"
   ```

### Uso de Repositórios JDBC

O projeto oferece suporte tanto a **JPA** quanto a **JDBC** para acessar o banco de dados. Por padrão, a aplicação utiliza **JPA**, mas é possível alternar para JDBC.

#### Habilitando o JDBC

Para utilizar os repositórios baseados em JDBC:

1. Abra o arquivo `application.properties` localizado em:

```
api/src/main/resources/application.properties
```

2. Localize a propriedade `app.useJdbc` e altere o valor para `true`:

```properties
app.useJdbc=true
```

**Nota:** Quando `app.useJdbc` está definido como `false`, a aplicação utiliza os repositórios JPA como padrão. Ao definir como `true`, a aplicação passa a utilizar os repositórios implementados com JDBC.

#### Como os Repositórios Funcionam

- **JPA**: Utiliza o `Spring Data JPA` e mapeamento de entidades com `@Entity` para persistência automática.
- **JDBC**: Utiliza consultas SQL diretas com `JdbcTemplate` para acessar os dados, garantindo maior controle sobre as queries e potencialmente melhor performance em algumas operações.

#### Considerações

- Certifique-se de que todas as tabelas e colunas estejam devidamente configuradas no PostgreSQL, pois os repositórios JDBC dependem da estrutura exata do banco.
- Ao alternar entre JPA e JDBC, não é necessário alterar a lógica do serviço ou dos controllers, pois a aplicação seleciona automaticamente a implementação com base na propriedade `app.useJdbc`.

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](../LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfolio**: [dariomatias-dev](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
