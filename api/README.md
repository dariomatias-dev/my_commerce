<div align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/PL_pgSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PL/pgSQL">
  <img src="https://img.shields.io/badge/Liquibase-005CA9?style=for-the-badge&logo=liquibase&logoColor=white" alt="Liquibase">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/MinIO-005A9C?style=for-the-badge&logo=minio&logoColor=white" alt="MinIO">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/JUnit5-25A162?style=for-the-badge&logo=junit5&logoColor=white" alt="JUnit 5">
  <img src="https://img.shields.io/badge/JaCoCo-C71585?style=for-the-badge&logoColor=white" alt="JaCoCo">
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
- [Construído com](#construído-com)
- [Liquibase e Versionamento de Banco de Dados](#liquibase-e-versionamento-de-banco-de-dados)
- [Como Começar](#como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Configuração do Banco de Dados com Docker](#configuração-do-banco-de-dados-com-docker)
  - [Rodando o Projeto](#rodando-o-projeto)
  - [Documentação da API (Swagger)](#documentação-da-api-swagger)
  - [Populando o Banco de Dados](#populando-o-banco-de-dados)
  - [Repositórios JPA e JDBC](#repositórios-jpa-e-jdbc)
- [Testes](#testes)
  - [Arquitetura dos Testes](#arquitetura-dos-testes)
  - [Services Testados](#services-testados)
  - [Controllers Testados](#controllers-testados)
  - [Cobertura Mínima (JaCoCo)](#cobertura-mínima-jacoco)
  - [Executando os Testes](#executando-os-testes)
- [Licença](#licença)
- [Autor](#autor)

## Sobre o Projeto

Este repositório contém o código-fonte do backend do Sistema SaaS de Lojas Virtuais. Desenvolvida como uma API RESTful utilizando Spring Boot e Java, esta parte do sistema é responsável por toda a lógica de negócio, persistência de dados e comunicação com o frontend web.

O backend gerencia autenticação, controle de acesso, gestão de usuários e assinaturas, operações CRUD para lojas e produtos, processamento de pedidos e geração de relatórios. Ele foi projetado para ser robusto, escalável e seguro, garantindo a integridade e a disponibilidade das informações da plataforma.

## Funcionalidades

As principais funcionalidades expostas por esta API incluem:

- **Gestão de Usuários e Assinaturas**: CRUD completo para usuários e controle de seus respectivos planos de assinatura (Starter, Pro, Business), com limites de lojas e produtos por plano.
- **Autenticação e Autorização**: Mecanismos de segurança para garantir acesso restrito a endpoints com base em perfis (User, Subscriber, Admin).
- **Gestão de Lojas Virtuais**: Operações para criar, ler, atualizar e excluir lojas, incluindo configuração de dados básicos e personalização.
- **Gestão de Produtos e Categorias**: APIs para gerenciar o catálogo de produtos de cada loja, incluindo nome, descrição, preço, estoque, status e imagens.
- **Processamento de Pedidos**: Funcionalidades para criar, acompanhar e gerenciar o ciclo de vida dos pedidos feitos pelos clientes finais.
- **Controle de Envio e Logística**: Gerenciamento de endereços, frete e prazos de entrega.
- **Relatórios e Métricas**: Geração de dados para dashboards e relatórios gerenciais sobre vendas, engajamento, assinantes ativos e produtos populares.
- **Moderação de Conteúdo**: Ferramentas para administradores moderarem lojas e produtos.

## Construído com

Este projeto foi desenvolvido utilizando as seguintes tecnologias e bibliotecas:

- **[Java](https://www.java.com/)** – Linguagem de programação amplamente usada para desenvolvimento de sistemas robustos e de alta performance.
- **[Spring Boot](https://spring.io/projects/spring-boot/)** – Framework Java para desenvolvimento de APIs robustas, escaláveis, seguras e de fácil manutenção.
- **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional poderoso e confiável para armazenamento de dados.
- **[PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql.html)** – Linguagem procedural do PostgreSQL para criar funções, triggers e lógica no banco de dados.
- **[Liquibase](https://www.liquibase.org/)** – Ferramenta para versionamento e gerenciamento de mudanças no banco de dados.
- **[Redis](https://redis.io/)** – Banco de dados em memória usado para caching de tokens e dados temporários.
- **[MinIO](https://min.io/)** – Sistema de armazenamento de objetos compatível com S3, usado para armazenar imagens de lojas e produtos.
- **[MongoDB](https://www.mongodb.com/)** – Banco de dados NoSQL orientado a documentos, usado para logs de auditoria e dados analíticos.
- **[Docker](https://www.docker.com/)** – Plataforma de conteinerização para padronização de ambientes e deploy simplificado.

## Liquibase e Versionamento de Banco de Dados

O projeto utiliza **Liquibase** para gerenciar e versionar alterações no banco de dados PostgreSQL. Todas as mudanças, incluindo criação de tabelas, funções e dados iniciais, são organizadas em arquivos de changelog que são executados de forma ordenada pelo Spring Boot. Isso garante consistência, rastreabilidade e facilidade de manutenção do esquema do banco em diferentes ambientes.

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

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `api/` baseando-se no `.env.example`. As variáveis disponíveis são:

| Variável                    | Descrição                                                        |
| --------------------------- | ---------------------------------------------------------------- |
| `DB_NAME`                   | Nome do banco de dados PostgreSQL                                |
| `DB_USER`                   | Usuário do banco de dados                                        |
| `DB_PASSWORD`               | Senha do banco de dados                                          |
| `DB_HOST`                   | Host do banco de dados (padrão: `localhost`)                     |
| `DB_PORT`                   | Porta do banco de dados (padrão: `1213`)                         |
| `JWT_SECRET`                | Segredo para geração e validação de tokens JWT                   |
| `JWT_ACCESS_EXPIRATION_MS`  | Tempo de expiração do access token em ms (ex: `86400000` = 24h)  |
| `JWT_REFRESH_EXPIRATION_MS` | Tempo de expiração do refresh token em ms (ex: `604800000` = 7d) |
| `MAIL_HOST`                 | Host do servidor SMTP                                            |
| `MAIL_PORT`                 | Porta do servidor SMTP                                           |
| `MAIL_USERNAME`             | Endereço de e-mail para envio                                    |
| `MAIL_PASSWORD`             | Senha ou app password do e-mail                                  |
| `ADMIN_PASSWORD`            | Senha do usuário administrador criado no boot                    |
| `MINIO_URL`                 | URL do servidor MinIO (padrão: `http://localhost:9000`)          |
| `MINIO_ACCESS_KEY`          | Chave de acesso do MinIO                                         |
| `MINIO_SECRET_KEY`          | Chave secreta do MinIO                                           |
| `MONGO_USER`                | Usuário do MongoDB                                               |
| `MONGO_PASSWORD`            | Senha do MongoDB                                                 |
| `MONGO_DB`                  | Nome do banco de dados MongoDB                                   |

### Configuração do Banco de Dados com Docker

O Docker Compose sobe todos os serviços necessários para o backend:

| Serviço    | Porta           | Descrição                                    |
| ---------- | --------------- | -------------------------------------------- |
| PostgreSQL | `1213`          | Banco de dados relacional principal          |
| Redis      | `6379`          | Cache e armazenamento de tokens              |
| MinIO      | `9000` / `9001` | Armazenamento de objetos (API / Console web) |
| MongoDB    | `27017`         | Logs de auditoria e dados analíticos         |

1. **Crie o arquivo `.env`** conforme descrito na seção [Variáveis de Ambiente](#variáveis-de-ambiente).

2. **Inicie os contêineres:**

   ```bash
   docker compose up -d
   ```

   > O console web do MinIO está disponível em `http://localhost:9001`.

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

### Documentação da API (Swagger)

A API fornece documentação interativa via **Swagger**, permitindo testar endpoints diretamente no navegador.

- **URL da documentação:** `http://localhost:8080/swagger-ui/index.html`
- Permite visualizar todos os endpoints disponíveis, parâmetros, tipos de retorno e exemplos de requisições e respostas.

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

#### Executando as Seeds

1. Certifique-se de que os contêineres Docker estejam em execução.
2. Navegue até o diretório `api`.
3. Para popular **todas as tabelas** de uma vez:

   ```bash
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.RunAllSeeds"
   ```

4. Para executar uma seed individualmente:

   ```bash
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.<pasta>.Run<Nome>Seed"
   ```

   **Exemplos:**

   ```bash
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.subscription_plan.RunSubscriptionPlanSeed"
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.user.RunUserSeed"
   ./mvnw exec:java -Dexec.mainClass="com.dariomatias.my_commerce.seed.store.RunStoreSeed"
   ```

   Seeds disponíveis: `admin_user`, `category`, `order`, `product`, `store`, `subscription`, `subscription_plan`, `user`, `user_address`.

### Repositórios JPA e JDBC

O projeto oferece suporte tanto a **JPA** quanto a **JDBC** para acessar o banco de dados. Por padrão, a aplicação utiliza **JPA**, mas é possível alternar para JDBC.

#### Habilitando o JDBC

Para utilizar os repositórios baseados em JDBC:

1. Abra o arquivo `application.properties` localizado em:

```
api/src/main/resources/application.properties
```

2. Localize a propriedade `app.persistence` e altere o valor para `jdbc`:

```properties
app.persistence=jdbc
```

#### Como os Repositórios Funcionam

- **JPA**: Utiliza o `Spring Data JPA` e mapeamento de entidades com `@Entity`.
- **JDBC**: Utiliza consultas SQL diretas com `JdbcTemplate` para acessar os dados, garantindo maior controle sobre as consultas e potencialmente melhor performance em algumas operações.

#### Considerações

- Certifique-se de que todas as tabelas e colunas estejam devidamente configuradas no PostgreSQL, pois os repositórios JDBC dependem da estrutura exata do banco.
- Ao alternar entre JPA e JDBC, não é necessário alterar a lógica dos controllers ou services, pois a aplicação seleciona automaticamente a implementação com base na propriedade `app.persistence`.

## Testes

O projeto conta com testes de unidade para as camadas de **service** e **controller**, escritos com **JUnit 5** e **Mockito**. Os testes de service usam `@ExtendWith(MockitoExtension.class)` com injeção via `@InjectMocks` e dependências mockadas com `@Mock`. Os testes de controller usam `@WebMvcTest` para isolar a camada web sem necessidade de banco de dados ou outros serviços externos.

### Arquitetura dos Testes

A annotation `@ControllerTest` (localizada em `src/test/java/.../annotation/`) encapsula a configuração padrão de todos os testes de controller:

- Carrega apenas a camada web (`@WebMvcTest`)
- Exclui a auto-configuração do Spring Security (`SecurityAutoConfiguration`, `SecurityFilterAutoConfiguration`) para isolar o controller
- Exclui o `JwtAuthenticationFilter` do slice de teste
- Permite injetar `MockMvc` e mockar services com `@MockitoBean`

A classe `TestWebMvcConfig` (localizada em `src/test/java/.../config/`) é uma `@TestConfiguration` compartilhada que registra o `AuthenticationPrincipalArgumentResolver`. Controllers que utilizam `@AuthenticationPrincipal` importam essa configuração via `@Import(TestWebMvcConfig.class)` e configuram o `SecurityContextHolder` no `@BeforeEach` com um usuário fictício via `UsernamePasswordAuthenticationToken`.

Os testes seguem os seguintes padrões:

- **`@Nested` por endpoint/método**: cada endpoint (controller) ou método público (service) possui uma classe interna `@Nested` com `@DisplayName`, agrupando o cenário de sucesso e os cenários de erro
- **`verify()` obrigatório**: todo teste que configura um mock com `when(...)` ou `doNothing()` finaliza com `verify(...)` para confirmar que a dependência foi invocada com os argumentos corretos
- **`verifyNoInteractions()`**: cenários de erro que devem abortar antes de chamar dependências verificam isso explicitamente
- **Testes de validação (controllers)**: endpoints com `@Valid` possuem testes adicionais que enviam payloads inválidos e verificam `400 Bad Request` com `verifyNoInteractions(service)`

### Services Testados

Testes de unidade pura com `@ExtendWith(MockitoExtension.class)`. Todas as dependências são mockadas; nenhum contexto Spring é carregado.

| Service           | Testes | Cenários cobertos                                                                                                                                                       |
| ----------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JwtService`          | 6  | `generateAccessToken` e `generateRefreshToken` (subject correto), `validateToken` (válido → true, expirado → false, inválido → false), `getIdFromToken` (parse correto) |
| `FreightService`      | 6  | Endereço não encontrado → 404, distância null → 400, distância ≤ 5 km → frete zero (< 5 km e = 5 km), distância > 5 km → cálculo econômico e express |
| `AuthService`         | 8  | Login (email não encontrado → 401, senha errada → 401 + audit, e-mail não verificado → 403 + audit, sucesso), Register (email duplicado → 409 + audit, dados válidos), RefreshToken (token inválido → 401 + audit, token válido) |
| `UserService`         | 6  | `getById` (não encontrado → 404, deletado + ADMIN → retorna, deletado + USER → 404), `changePassword` (senha errada → 400, senha correta → atualiza), `delete` (cascata stores/products/MinIO) |
| `CategoryService`     | 7  | `create` (loja não encontrada → 404, loja encontrada → cria), `getAll` (filtro null → 400, loja não encontrada → 404, filtro válido → página), `update` (name null → não altera, name preenchido → altera) |
| `SubscriptionService` | 5  | `changePlan` (sem assinatura ativa → 400, mesmo plano → 400, plano diferente → desativa atual e cria nova), `cancelActiveSubscription` (sem ativa → 400, com ativa → cancela e reverte role para USER) |
| `OrderService`        | 7  | `create` (itens vazios → 400, endereço de outro usuário → 400, dados válidos → status COMPLETED verificado via ArgumentCaptor), `getById` (404, não-dono com USER → 403, dono retorna DTO, ADMIN acessa pedido de qualquer usuário) |
| `StoreService`        | 10 | `create` (sem assinatura → 404, limite de lojas → 422, slug duplicado → 409, com logo/banner → upload MinIO, sem imagens → sem upload), `update` (slug duplicado → 409, com imagens → upload MinIO), `getBySlug` (não encontrada → 404, inativa + anônimo → 404, ativa → retorna) |
| `UserAddressService`  | 5  | `update` (não encontrado → `IllegalArgumentException`, endereço de outro usuário → `IllegalArgumentException`, dono → atualiza e retorna DTO), `delete` (outro usuário → `IllegalArgumentException`, dono → soft delete) |
| `AnalyticsService`    | 7  | `getTotalRevenue(userId)` (null → ZERO, valor → encapsula), `getTotalRevenue()` global (null → ZERO, valor → retorna), `verifyStoreAccess` via `getUniqueCustomersByStore` (ADMIN bypassa, loja não encontrada → 404, não-proprietário → 403) |
| `AuditLogService`     | 4  | `log` (salva campos corretos + timestamp), `getById` (id existente → retorna, id inexistente → null), `getLogs` (delega count e find ao MongoTemplate e retorna página) |
| `SubscriptionPlanService` | 10 | `create` (nome duplicado → 400, nome único → salva), `getById` (inexistente → 404, existente → retorna), `update` (não encontrado → 404, nome conflitante → 400, campos null → preserva valores, mesmo nome → sem check de conflito), `delete` (inexistente → 404, existente → deleteById) |
| `EmailService`            | 4  | `sendVerificationEmail` (envia MimeMessage, propaga MailSendException), `sendPasswordRecoveryEmail` (envia MimeMessage, propaga MailSendException) |
| `MinioService`            | 18 | `uploadFile` (> 5MB → 400, tipo inválido → 400, tipo null → 400, JPEG válido → putObject, PNG válido → putObject), `deleteFile` (sucesso, erro MinIO → 500), `listObjects` (retorna nomes, pasta vazia), `copyFile` (sucesso, erro → 500), `createBucket` (bucket existente → sem makeBucket, inexistente → cria + política, erro → 500), `deleteFolder` (remove objetos, pasta vazia → sem removeObject), `uploadImage` (sucesso, erro → 500) |
| `ProductImageService`     | 12 | `upload` (null → vazio, array vazio → vazio, imagens válidas → upload + save, posições continuam após existentes, objectName contém slugs no path), `removeImages` (null → nada, vazio → nada, URL correspondente → deleta MinIO + remove produto, URL não correspondente → nada, posições reordenadas após remoção), `rename` (copia + deleta cada objeto, pasta vazia → sem cópia nem delete) |
| `ProductService`          | 43 | `create` (loja 404, loja de outro usuário 403, sem assinatura 404, limite plano 422, plano ilimitado sem contagem, categoria 404, categoria de outra loja 400, slug duplicado 409, dados válidos → salva + upload, ADMIN pula assinatura), `getAllByStore` (null filter+user → ACTIVE sem erro, DELETED+USER → 403, ALL+null → 403, DELETED+ADMIN → página, ACTIVE+null → página), `getActiveProductsByStoreAndIds` (loja 404, loja deletada 404, IDs null → empty, IDs vazios → empty, válido → página), `getByStoreSlugAndProductSlug` (loja 404, produto 404, válido → retorna), `getById` (ADMIN: 404, retorna deletado; USER: 404, retorna ativo), `getUserActiveProductsCount` (delega ao repositório), `getActiveProductsCount` (loja 404, retorna contagem), `update` (produto 404, loja 404, não dono 403, categoria 404, categoria outra loja 400, slug duplicado 409, mudança de nome → rename + update, campos null preserva valores), `delete` (produto 404, loja 404, não dono 403, válido → remove imagens + delete, ADMIN deleta de qualquer loja) |

**Total: 158 testes de service.**

### Controllers Testados

| Controller                   | Testes | Endpoints cobertos                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthController`             | 16     | `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification-email`, `POST /api/auth/recover-password`, `POST /api/auth/reset-password`, `POST /api/auth/refresh-token`                                                                                                                     |
| `UserController`             | 14     | `GET /api/users`, `GET /api/users/{id}`, `PATCH /api/users/{id}`, `DELETE /api/users/{id}`, `GET /api/users/stats/active-users`, `GET /api/users/me`, `PATCH /api/users/me`, `POST /api/users/me/change-password`, `DELETE /api/users/me`                                                                                                          |
| `OrderController`            | 12     | `POST /api/orders`, `GET /api/orders`, `GET /api/orders/user/{userId}`, `GET /api/orders/store/{storeId}`, `GET /api/orders/me`, `GET /api/orders/me/stores`, `GET /api/orders/me/store/{storeId}`, `GET /api/orders/{id}`, `GET /api/orders/store/{storeId}/stats/successful-sales`, `DELETE /api/orders/{id}`                                    |
| `ProductController`          | 9      | `POST /api/products`, `GET /api/products`, `POST /api/products/store/products-by-ids`, `GET /api/products/store/{storeSlug}/product/{productSlug}`, `GET /api/products/{id}`, `GET /api/products/stores/stats/active-products`, `GET /api/products/store/{storeId}/stats/active-products`, `PATCH /api/products/{id}`, `DELETE /api/products/{id}` |
| `StoreController`            | 8      | `POST /api/stores`, `GET /api/stores`, `GET /api/stores/me`, `GET /api/stores/{id}`, `GET /api/stores/slug/{slug}`, `GET /api/stores/active/count`, `PATCH /api/stores/{id}`, `DELETE /api/stores/{id}`                                                                                                                                            |
| `SubscriptionController`     | 8      | `POST /api/subscriptions`, `GET /api/subscriptions`, `GET /api/subscriptions/user/{userId}`, `GET /api/subscriptions/user/me`, `GET /api/subscriptions/me/active`, `GET /api/subscriptions/{id}`, `PATCH /api/subscriptions/change-plan`, `PATCH /api/subscriptions/cancel`                                                                        |
| `AnalyticsController`        | 5      | `GET /api/analytics/me/stats/unique-customers`, `GET /api/analytics/me/stats/total-revenue`, `GET /api/analytics/store/{storeId}/stats/unique-customers`, `GET /api/analytics/store/{storeId}/stats/total-revenue`, `GET /api/analytics/total-revenue`                                                                                             |
| `CategoryController`         | 5      | `POST /api/categories`, `GET /api/categories`, `GET /api/categories/{id}`, `PATCH /api/categories/{id}`, `DELETE /api/categories/{id}`                                                                                                                                                                                                             |
| `SubscriptionPlanController` | 5      | `POST /api/subscription-plans`, `GET /api/subscription-plans`, `GET /api/subscription-plans/{id}`, `PATCH /api/subscription-plans/{id}`, `DELETE /api/subscription-plans/{id}`                                                                                                                                                                     |
| `FileController`             | 4      | `GET /api/files/{bucket}/**` (bucket inválido, erro MinIO, path traversal, arquivo válido)                                                                                                                                                                                                                                                         |
| `UserAddressController`      | 4      | `POST /api/addresses`, `GET /api/addresses`, `PUT /api/addresses/{id}`, `DELETE /api/addresses/{id}`                                                                                                                                                                                                                                               |
| `AuditLogController`         | 2      | `GET /api/audit-logs`, `GET /api/audit-logs/{id}`                                                                                                                                                                                                                                                                                                  |
| `FreightController`          | 1      | `GET /api/freight/{userAddressId}`                                                                                                                                                                                                                                                                                                                 |

**Total: 93 testes de controller**, cobrindo os seguintes padrões de requisição:

| Tipo                               | Exemplos                                                              |
| ---------------------------------- | --------------------------------------------------------------------- |
| GET com payload na resposta        | `getAll`, `getById` em todos os controllers                           |
| POST/PATCH/PUT com payload no body | `create`, `update`, `login`, `signup`                                 |
| Path params                        | `/{id}`, `/user/{userId}`, `/store/{storeId}`                         |
| Query params                       | `?page=0&size=10`, `?storeId=...`                                     |
| Multipart                          | upload de imagens em `StoreController` e `ProductController`          |
| Validação de entrada (`@Valid`)    | cenários 400 em `AuthController`, `UserController`, `OrderController` |

### Cobertura Mínima (JaCoCo)

O JaCoCo está configurado no `pom.xml` para validar automaticamente a cobertura dos 13 controllers monitorados:

| Métrica                                  | Mínimo exigido |
| ---------------------------------------- | -------------- |
| Cobertura de linha (_line coverage_)     | 90%            |
| Cobertura de decisão (_branch coverage_) | 80%            |

### Executando os Testes

**Rodar todos os testes (service + controller):**

```bash
./mvnw test
```

**Rodar apenas um teste específico:**

```bash
./mvnw test -Dtest="AuthServiceTest"
./mvnw test -Dtest="AuthControllerTest"
```

**Rodar todos os testes de service:**

```bash
./mvnw test -Dtest="JwtServiceTest,FreightServiceTest,AuthServiceTest,UserServiceTest,CategoryServiceTest,SubscriptionServiceTest,OrderServiceTest,StoreServiceTest,UserAddressServiceTest,AnalyticsServiceTest,AuditLogServiceTest,SubscriptionPlanServiceTest,EmailServiceTest,MinioServiceTest,ProductImageServiceTest,ProductServiceTest"
```

**Rodar todos os testes com verificação de cobertura JaCoCo:**

```bash
./mvnw clean jacoco:prepare-agent package jacoco:check -Dmaven.test.failure.ignore=true
```

- `BUILD SUCCESS` → cobertura mínima atingida.
- `BUILD FAILURE` com mensagem `Rule violated` → cobertura abaixo do mínimo exigido.

**Gerar relatório HTML detalhado de cobertura:**

```bash
./mvnw test jacoco:report
```

O relatório é gerado em `target/site/jacoco/index.html`.

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](../LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfolio**: [dariomatias-dev](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
