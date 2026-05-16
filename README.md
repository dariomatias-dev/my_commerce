<br>

<div align="center">
<img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java">
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</div>
<br>

<h1 align="center">Sistema SaaS de Lojas Virtuais</h1>

<p align="center">
Uma solução SaaS completa e escalável para pequenos empreendedores criarem e gerenciarem suas lojas virtuais.
<br>
<a href="#sobre-o-projeto"><strong>Explore a documentação »</strong></a>
<br>
<br>
<a href="https://my-commerce-dariomatias-dev.vercel.app">Ver Demo</a> ·
<a href="https://github.com/dariomatias-dev/my_commerce/issues">Reportar Bug</a> ·
<a href="https://github.com/dariomatias-dev/my_commerce/issues">Solicitar Funcionalidade</a>
</p>

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Documentação do Backend](#documentação-do-backend)
- [Documentações do Sistema](#documentações-do-sistema)
- [Construído com](#construído-com)
- [Controle de Acesso](#controle-de-acesso)
- [Como Começar](#como-começar)
- [Licença](#licença)
- [Autor](#autor)

## Sobre o Projeto

O Sistema SaaS de Lojas Virtuais é uma plataforma desenvolvida para capacitar pequenos empreendedores, autônomos e negócios locais a estabelecerem sua presença online de forma rápida, simples e acessível. A plataforma oferece uma solução completa para criação, configuração e gestão de lojas virtuais, com foco em personalização, gestão de produtos e análise de desempenho, por meio de um modelo de assinatura escalável.

A plataforma visa simplificar a criação de uma loja virtual para quem não possui conhecimentos técnicos avançados, permitindo que qualquer assinante crie e gerencie sua própria loja com facilidade.

Este projeto está sendo desenvolvido como parte das disciplinas: Desenvolvimento de Aplicações Web II (DAW II), Banco de Dados II (BD II) e Análise e Projeto de Sistemas (APS).

## Estrutura do Repositório

Este projeto é organizado como um **monorepo**, reunindo todos os módulos em um único repositório:

```
my_commerce/
├── api/    # Backend (Java + Spring Boot)
├── web/    # Frontend Web (Next.js)
├── package.json
└── pnpm-workspace.yaml
```

## Documentação do Backend

O **Backend** do Sistema SaaS de Lojas Virtuais possui documentação detalhada que explica a arquitetura, modelos de dados, autenticação, regras de negócio e integração com o módulo frontend.

A documentação é acessível via Swagger/OpenAPI, permitindo explorar a API, testar chamadas e compreender o fluxo do sistema de forma prática e clara.

## Documentações do Sistema

O **Sistema SaaS de Lojas Virtuais** é composto por dois módulos principais: Backend e Frontend Web. Cada módulo possui seu próprio README detalhando instalação, execução, pré-requisitos e funcionalidades específicas.

Para facilitar a navegação e consulta, utilize os links abaixo:

| Módulo                   | Descrição                                                                                                                                                                                                                               | Link para README                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Backend** (`api`)      | API RESTful desenvolvida em **Java** e **Spring Boot**, responsável pela lógica de negócio, persistência de dados e comunicação com o cliente web. Inclui autenticação, gestão de usuários, lojas, produtos e processamento de pedidos. | [Leia o README do Backend](./api/README.md)      |
| **Frontend Web** (`web`) | Interface web construída com **Next.js**, **TypeScript** e **Tailwind CSS**, permitindo que os assinantes gerenciem suas lojas, produtos e pedidos de forma intuitiva e responsiva.                                                     | [Leia o README do Frontend Web](./web/README.md) |

**Observação:** Antes de iniciar o Frontend, certifique-se de que o **Backend** esteja rodando corretamente e que o banco de dados PostgreSQL esteja ativo (via Docker), para garantir que todos os módulos funcionem de forma integrada.

## Construído com

### Frontend Web

- **[TypeScript](https://www.typescriptlang.org/)** – Superset do JavaScript que adiciona tipagem estática opcional, aumentando a segurança, previsibilidade e manutenibilidade do código.
- **[Next.js (TypeScript)](https://nextjs.org/)** – Framework React moderno com foco em performance, SEO, renderização híbrida (SSR/SSG) e roteamento avançado.
- **[Tailwind CSS](https://tailwindcss.com/)** – Framework CSS utilitário para estilização ágil, responsiva e altamente customizável.
- **[Shadcn/UI](https://ui.shadcn.com/)** – Conjunto de componentes acessíveis e personalizáveis para criação de interfaces modernas.
- **[React Hook Form](https://react-hook-form.com/)** – Biblioteca performática para gerenciamento de formulários com validação simples e eficiente.
- **[Zod](https://zod.dev/)** – Biblioteca de validação de esquemas com tipagem forte e validação em tempo de execução.
- **[Lucide React](https://lucide.dev/)** – Biblioteca de ícones SVG leves, consistentes e facilmente customizáveis.

### Backend

- **[Java](https://www.java.com/)** – Linguagem de programação amplamente usada para desenvolvimento de sistemas robustos e de alta performance.
- **[Spring Boot](https://spring.io/projects/spring-boot/)** – Framework Java para desenvolvimento de APIs robustas, escaláveis, seguras e de fácil manutenção.
- **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional poderoso e confiável para armazenamento de dados.
- **[PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql.html)** – Linguagem procedural do PostgreSQL para criar funções, triggers e lógica no banco de dados.
- **[Liquibase](https://www.liquibase.org/)** – Ferramenta para versionamento e gerenciamento de mudanças no banco de dados.
- **[Redis](https://redis.io/)** – Banco de dados em memória, ultra-rápido, usado para caching, filas e armazenamento temporário.
- **[MinIO](https://min.io/)** – Sistema de armazenamento de objetos compatível com S3, ideal para arquivos e mídias.
- **[Docker](https://www.docker.com/)** – Plataforma de conteinerização para padronização de ambientes e deploy simplificado.

## Controle de Acesso

O sistema implementa um controle de acesso baseado em perfis para garantir a segurança e a segregação de funcionalidades:

- **User**: Perfil para clientes finais que interagem com as lojas.
- **Subscriber**: Usuários com assinatura ativa, que são proprietários das lojas e gerenciam seus negócios.
- **Admin**: Administrador do sistema, com controle total sobre usuários, assinaturas, lojas e conteúdo.

## Como Começar

Para executar o projeto **my_commerce** localmente, siga os passos abaixo. O sistema é composto por **Backend (API)** e **Frontend Web**, sendo possível executar cada parte de forma independente.

### Início Rápido

Após clonar o repositório e configurar os arquivos `.env` (veja [Instalação](#instalação)), execute tudo com três comandos:

```bash
# 1. Instalar dependências
pnpm install

# 2. Compilar o backend
pnpm api:build

# 3. Subir tudo (Docker + API + Web)
pnpm demo
```

O comando `pnpm demo` inicia os containers Docker, o servidor Spring Boot e o frontend Next.js simultaneamente, com logs coloridos por serviço.

> A aplicação web estará disponível em `http://localhost:3000` e a API em `http://localhost:8080`.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- **Node.js** (para o Frontend Web)
- **pnpm** (gerenciador de pacotes)
- **Java Development Kit (JDK)** versão 17 ou superior (para o Backend)
- **Maven** (gerenciamento de dependências do Backend)
- **Docker** e **Docker Compose** (conteinerização dos serviços)

### Instalação

#### 1. Clonar o Repositório

Clone o repositório principal do projeto:

```bash
git clone https://github.com/dariomatias-dev/my_commerce.git

cd my_commerce
```

#### 2. Configurar e Rodar o Backend (Java + Spring Boot)

1. Acesse a pasta do backend:

```bash
cd api
```

2. Crie um arquivo `.env` com base no `.env.example`, ajustando as variáveis conforme necessário.

3. Suba os containers docker:

```bash
docker compose up -d
```

4. Execute a aplicação Spring Boot (via IntelliJ ou terminal):

```bash
./mvnw clean install

./mvnw spring-boot:run
```

Durante a inicialização, o **Liquibase** será responsável por criar automaticamente extensões, tabelas, constraints e funções PL/pgSQL no banco de dados.

Após esse processo, a API estará disponível e pronta para uso.

#### 3. Configurar e Rodar o Frontend Web (Next.js)

1. Na raiz do repositório, instale as dependências:

```bash
pnpm install
```

2. Acesse a pasta do frontend:

```bash
cd web
```

3. Crie um arquivo `.env` com base no `.env.example`.

4. Inicie o servidor de desenvolvimento:

```bash
pnpm run dev
```

A aplicação web estará disponível em:

```
http://localhost:3000
```

> **Observação:** O backend deve estar em execução para que o frontend funcione corretamente.

#### 4. Populando o Banco de Dados (Opcional)

O projeto conta com **seeds** para geração automática de dados de desenvolvimento e teste.
Para gerar registros em todas as tabelas, acesse a pasta `seeds` no backend e execute a classe `RunAllSeeds`.

</br>

As documentações do **backend** e **frontend** estão disponíveis nos respectivos arquivos `README`, detalhando a estrutura dos projetos, tecnologias utilizadas, variáveis de ambiente e instruções complementares para facilitar a execução, entendimento e manutenção do sistema.

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfolio**: [dariomatias-dev](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
