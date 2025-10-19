# **Produtos** (`/api/products/*`)

Conjunto de endpoints responsáveis pelo **gerenciamento de produtos** no sistema.
Permitem que usuários autenticados (assinantes ou administradores) **criem, visualizem, atualizem e excluam** produtos vinculados às suas lojas.

Cada produto pertence a uma loja e a uma categoria, podendo conter múltiplas imagens.

---

## **Funcionalidades**

- **Criar produto** – Cria um novo produto vinculado a uma loja do usuário autenticado.
- **Listar produtos** – Lista todos os produtos disponíveis.
- **Listar produtos por loja** – Retorna produtos específicos de uma loja.
- **Listar produtos por categoria** – Retorna produtos pertencentes a uma categoria.
- **Obter produto por ID** – Retorna os detalhes de um produto específico.
- **Atualizar produto** – Atualiza os dados de um produto existente.
- **Excluir produto** – Remove um produto existente do sistema.

Todos os endpoints utilizam o caminho base `/api/products/*` e seguem o padrão de resposta `ApiResponse<T>`.

---

## **Criar Produto**

- **Endpoint**: `POST /api/products`
- **Objetivo**: Criar um novo produto vinculado à loja do usuário autenticado.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Request Body**:

```json
{
  "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
  "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
  "name": "Fone de Ouvido Bluetooth",
  "description": "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
  "price": 199.9,
  "stock": 50,
  "active": true,
  "images": [
    "https://meusite.com/images/fone1.jpg",
    "https://meusite.com/images/fone2.jpg"
  ]
}
```

**Responses**:

- **200 OK** – Produto criado com sucesso.
- **404 Not Found** – Loja ou categoria não encontrada.
- **403 Forbidden** – Usuário não é o proprietário da loja.
- **400 Bad Request** – Dados inválidos.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Produto criado com sucesso",
  "data": {
    "id": "21f1b8e4-2f17-43f7-9b32-1b6d013ea056",
    "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
    "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
    "name": "Fone de Ouvido Bluetooth",
    "description": "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
    "price": 199.9,
    "stock": 50,
    "active": true,
    "images": [
      "https://meusite.com/images/fone1.jpg",
      "https://meusite.com/images/fone2.jpg"
    ],
    "createdAt": "2025-10-19T07:26:42.596896",
    "updatedAt": "2025-10-19T07:26:42.596924"
  },
  "errors": null
}
```

---

## **Listar Produtos**

- **Endpoint**: `GET /api/products`
- **Objetivo**: Listar todos os produtos disponíveis (visíveis publicamente).
- **Autorização**: Livre acesso (não requer autenticação).

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de produtos por página.

**Responses**:

- **200 OK** – Retorna lista paginada de produtos.
- **204 No Content** – Nenhum produto encontrado.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Produtos obtidos com sucesso",
  "data": {
    "content": [
      {
        "id": "21f1b8e4-2f17-43f7-9b32-1b6d013ea056",
        "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
        "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
        "name": "Fone de Ouvido Bluetooth",
        "description": "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
        "price": 199.9,
        "stock": 50,
        "active": true,
        "images": [
          "https://meusite.com/images/fone1.jpg",
          "https://meusite.com/images/fone2.jpg"
        ],
        "createdAt": "2025-10-19T07:26:42.596896",
        "updatedAt": "2025-10-19T07:26:42.596924"
      }
    ],
    "totalPages": 3,
    "totalElements": 21,
    "last": false,
    "first": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 10,
    "empty": false
  },
  "errors": null
}
```

---

## **Listar Produtos por Loja**

- **Endpoint**: `GET /api/products/store/{storeId}`
- **Objetivo**: Listar todos os produtos de uma loja específica.
- **Autorização**: Livre acesso (não requer autenticação).

**Path Parameters**:

- `storeId` (UUID): ID da loja.

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de produtos por página.

**Responses**:

- **200 OK** – Produtos da loja retornados com sucesso.
- **404 Not Found** – Loja não encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Produtos da loja obtidos com sucesso",
  "data": {
    "content": [
      {
        "id": "b13c2749-9954-4414-a41a-8f73e41b21ad",
        "storeId": "2abf13c3-cd94-4659-9130-2a3a70d993b9",
        "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
        "name": "Camiseta Oversized",
        "description": "Camiseta de algodão de alta gramatura com caimento moderno.",
        "price": 129.9,
        "stock": 30,
        "active": true,
        "images": ["https://meusite.com/images/camiseta1.jpg"],
        "createdAt": "2025-10-19T10:00:00.000",
        "updatedAt": "2025-10-19T10:00:00.000"
      }
    ],
    "totalPages": 1,
    "totalElements": 1,
    "last": true,
    "first": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 1,
    "empty": false
  },
  "errors": null
}
```

---

## **Listar Produtos por Categoria**

- **Endpoint**: `GET /api/products/category/{categoryId}`
- **Objetivo**: Listar produtos pertencentes a uma categoria específica.
- **Autorização**: Livre acesso (não requer autenticação).

**Path Parameters**:

- `categoryId` (UUID): ID da categoria.

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de produtos por página.

**Responses**:

- **200 OK** – Produtos da categoria retornados com sucesso.
- **404 Not Found** – Categoria não encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Produtos da categoria obtidos com sucesso",
  "data": {
    "content": [
      {
        "id": "2e4d45b9-93af-44b4-aaf2-bf6f9c807c2f",
        "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
        "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
        "name": "Calça Jeans Slim",
        "description": "Calça jeans com elastano, corte ajustado e costura reforçada.",
        "price": 179.9,
        "stock": 25,
        "active": true,
        "images": ["https://meusite.com/images/calca1.jpg"],
        "createdAt": "2025-10-19T10:20:00.000",
        "updatedAt": "2025-10-19T10:20:00.000"
      }
    ],
    "totalPages": 2,
    "totalElements": 12,
    "last": false,
    "first": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 10,
    "empty": false
  },
  "errors": null
}
```

---

## **Obter Produto por ID**

- **Endpoint**: `GET /api/products/{id}`
- **Objetivo**: Obter os detalhes de um produto específico.
- **Autorização**: Livre acesso (não requer autenticação).

**Path Parameters**:

- `id` (UUID): ID do produto.

**Responses**:

- **200 OK** – Produto encontrado.
- **404 Not Found** – Produto não encontrado.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Produto obtido com sucesso",
  "data": {
    "id": "2e4d45b9-93af-44b4-aaf2-bf6f9c807c2f",
    "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
    "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
    "name": "Calça Jeans Slim",
    "description": "Calça jeans com elastano, corte ajustado e costura reforçada.",
    "price": 179.9,
    "stock": 25,
    "active": true,
    "images": ["https://meusite.com/images/calca1.jpg"],
    "createdAt": "2025-10-19T10:20:00.000",
    "updatedAt": "2025-10-19T10:20:00.000"
  },
  "errors": null
}
```

---

## **Atualizar Produto**

- **Endpoint**: `PATCH /api/products/{id}`
- **Objetivo**: Atualizar os dados de um produto existente.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID do produto.

**Request Body** (campos opcionais):

```json
{
  "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
  "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
  "name": "Fone de Ouvido Bluetooth",
  "description": "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
  "price": 199.9,
  "stock": 50,
  "active": true,
  "images": [
    "https://meusite.com/images/fone1.jpg",
    "https://meusite.com/images/fone2.jpg"
  ]
}
```

**Responses**:

- **200 OK** – Produto atualizado com sucesso.
- **404 Not Found** – Produto não encontrado.
- **403 Forbidden** – Usuário não tem permissão para editar este produto.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Produto atualizado com sucesso",
  "data": {
    "id": "21f1b8e4-2f17-43f7-9b32-1b6d013ea056",
    "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
    "categoryId": "f71ccab3-71f2-4dc2-a476-0a6225b04e34",
    "name": "Fone de Ouvido Bluetooth Pro",
    "description": "Versão atualizada com mais cancelamento de ruído e autonomia estendida.",
    "price": 249.9,
    "stock": 40,
    "active": true,
    "images": [
      "https://meusite.com/images/fone1.jpg",
      "https://meusite.com/images/fone2.jpg"
    ],
    "createdAt": "2025-10-19T07:26:42.596896",
    "updatedAt": "2025-10-19T11:05:18.129542"
  },
  "errors": null
}
```

---

## **Excluir Produto**

- **Endpoint**: `DELETE /api/products/{id}`
- **Objetivo**: Excluir um produto existente.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID do produto.

**Responses**:

- **200 OK** – Produto excluído com sucesso.
- **404 Not Found** – Produto não encontrado.
- **403 Forbidden** – Usuário não tem permissão para excluir este produto.
