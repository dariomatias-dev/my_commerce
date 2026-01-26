<br>
<div align="center">
<img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn/UI">
</div>
<br>

<h1 align="center">Sistema SaaS de Lojas Virtuais – Frontend Web</h1>

<p align="center">
A interface administrativa e dashboard do Sistema SaaS, construída com Next.js, TypeScript e Tailwind CSS para gestão completa de lojas virtuais.
<br>
<a href="#sobre-o-projeto"><strong>Explore a documentação »</strong></a>
<br>
<br>
<a href="https://github.com/dariomatias-dev/my_commerce">Repositório Principal</a> ·
<a href="https://my-commerce-dariomatias-dev.vercel.app">Ver Demo</a> ·
<a href="https://github.com/dariomatias-dev/my_commerce/issues">Reportar Bug</a> ·
<a href="https://github.com/dariomatias-dev/my_commerce/issues">Solicitar Recurso</a>
</p>

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Construído com](#construído-com)
- [Arquitetura e Padrões](#arquitetura-e-padrões)
- [Como Começar](#como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Rodando o Projeto](#rodando-o-projeto)
- [Licença](#licença)
- [Autor](#autor)

## Sobre o Projeto

Este repositório contém o código-fonte do Frontend Web do Sistema SaaS de Lojas Virtuais. Esta aplicação é o centro de controle para os assinantes (Subscribers) e administradores (Admin) da plataforma.

Desenvolvido com Next.js 16+ e a moderna App Router, o frontend oferece uma experiência de usuário (UX) fluida e responsiva. O objetivo principal é fornecer aos empreendedores uma interface intuitiva para configurar suas lojas, gerenciar catálogos de produtos, acompanhar vendas em tempo real e visualizar métricas de desempenho através de um dashboard completo.

## Funcionalidades

As principais funcionalidades da interface web incluem:

- **Dashboard de Vendas**: Visualização de métricas-chave como faturamento total e por loja, número de pedidos e novos clientes via gráficos interativos.
- **Gestão de Catálogo**: Interface completa para CRUD de produtos, categorias e variações, com upload de imagens integrado ao MinIO (via Backend).
- **Configuração da Loja**: Personalização de dados da loja e aparência.
- **Painel de Pedidos**: Gerenciamento do fluxo de pedidos, permitindo alterar status (Pendente, Preparando, Enviado, Entregue).
- **Gestão de Assinatura**: Espaço para o usuário Subscriber gerenciar seu plano atual.
- **Controle Administrativo**: Painel exclusivo para o Admin monitorar todas as lojas ativas, usuários e moderar conteúdos da plataforma.

## Construído com

O frontend utiliza as tecnologias mais modernas do ecossistema React:

- **[TypeScript](https://www.typescriptlang.org/)** – Superset do JavaScript que adiciona tipagem estática opcional, aumentando a segurança, previsibilidade e manutenibilidade do código.
- **[Next.js (TypeScript)](https://nextjs.org/)** – Framework React moderno com foco em performance, SEO, renderização híbrida (SSR/SSG) e roteamento avançado.
- **[Tailwind CSS](https://tailwindcss.com/)** – Framework CSS utilitário para estilização ágil, responsiva e altamente customizável.
- **[Shadcn/UI](https://ui.shadcn.com/)** – Conjunto de componentes acessíveis e personalizáveis para criação de interfaces modernas.
- **[React Hook Form](https://react-hook-form.com/)** – Biblioteca performática para gerenciamento de formulários com validação simples e eficiente.
- **[Zod](https://zod.dev/)** – Biblioteca de validação de esquemas com tipagem forte e validação em tempo de execução.
- **[Lucide React](https://lucide.dev/)** – Biblioteca de ícones SVG leves, consistentes e facilmente customizáveis.

## Arquitetura e Padrões

O projeto segue padrões de organização que visam a escalabilidade:

- **Hooks Customizados**: Lógica de consumo da API isolada em hooks para reutilização e limpeza de código.
- **Services Layer**: Camada dedicada para chamadas HTTP utilizando Axios.
- **Middleware**: Controle de rotas protegidas baseado nos perfis de acesso (User, Subscriber, Admin).

## Como Começar

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

### Pré-requisitos

- **Node.js**: Versão 18.0 ou superior.
- **pnpm**: Recomendado como gerenciador de pacotes (instale via `npm install -g pnpm`).
- **Backend Rodando**: É necessário que a API Java/Spring Boot esteja ativa para o funcionamento dos dados.

### Instalação

Clonar o Repositório Principal (caso ainda não tenha feito):

```bash
git clone https://github.com/dariomatias-dev/my_commerce.git
cd my_commerce
```

Navegar até o Diretório Web:

```bash
cd web
```

Instalar Dependências:

```bash
pnpm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `web` baseando-se no arquivo `.env_example`.

### Rodando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](../LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfolio**: [dariomatias-dev](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
