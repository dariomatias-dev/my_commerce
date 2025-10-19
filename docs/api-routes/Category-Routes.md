# **Categorias** (`/api/categories/*`)

Conjunto de endpoints responsáveis pelo **gerenciamento de categorias** de produtos no sistema.
Permitem que administradores ou usuários autorizados **criem, visualizem, atualizem e excluam** categorias vinculadas a lojas.

Cada categoria pertence a uma loja e possui um nome único dentro da loja.

---

## **Funcionalidades**

- **Criar categoria** – Cria uma nova categoria vinculada a uma loja.
- **Listar categorias** – Lista todas as categorias (paginadas).
- **Listar categorias por loja** – Retorna categorias específicas de uma loja.
- **Obter categoria por ID** – Retorna os detalhes de uma categoria específica.
- **Atualizar categoria** – Atualiza os dados de uma categoria existente.
- **Excluir categoria** – Remove uma categoria existente do sistema.

Todos os endpoints utilizam o caminho base `/api/categories/*` e seguem o padrão de resposta `ApiResponse<T>`.

---

## **Criar Categoria**

- **Endpoint**: `POST /api/categories`
- **Objetivo**: Criar uma nova categoria vinculada a uma loja.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Request Body**:

```json
{
  "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
  "name": "Eletrônicos"
}
```

**Responses**:

- **200 OK** – Categoria criada com sucesso.
- **404 Not Found** – Loja não encontrada.
- **400 Bad Request** – Dados inválidos.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": "21f1b8e4-2f17-43f7-9b32-1b6d013ea056",
    "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
    "name": "Eletrônicos",
    "createdAt": "2025-10-19T08:00:00.000",
    "updatedAt": "2025-10-19T08:00:00.000"
  },
  "errors": null
}
```

---

## **Listar Categorias**

- **Endpoint**: `GET /api/categories`
- **Objetivo**: Listar todas as categorias do sistema (paginadas).
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de categorias por página.

**Responses**:

- **200 OK** – Lista paginada de categorias.
- **204 No Content** – Nenhuma categoria encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Categorias obtidas com sucesso",
  "data": {
    "content": [
      {
        "id": "21f1b8e4-2f17-43f7-9b32-1b6d013ea056",
        "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
        "name": "Eletrônicos",
        "createdAt": "2025-10-19T08:00:00.000",
        "updatedAt": "2025-10-19T08:00:00.000"
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

## **Listar Categorias por Loja**

- **Endpoint**: `GET /api/categories/store/{storeId}`
- **Objetivo**: Listar todas as categorias de uma loja específica (paginadas).
- **Autorização**: Livre acesso (não requer autenticação).

**Path Parameters**:

- `storeId` (UUID): ID da loja.

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de categorias por página.

**Responses**:

- **200 OK** – Categorias da loja retornadas com sucesso.
- **404 Not Found** – Loja não encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Categorias obtidas com sucesso",
  "data": {
    "content": [
      {
        "id": "b13c2749-9954-4414-a41a-8f73e41b21ad",
        "storeId": "2abf13c3-cd94-4659-9130-2a3a70d993b9",
        "name": "Roupas",
        "createdAt": "2025-10-19T09:00:00.000",
        "updatedAt": "2025-10-19T09:00:00.000"
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

## **Obter Categoria por ID**

- **Endpoint**: `GET /api/categories/{id}`
- **Objetivo**: Obter os detalhes de uma categoria específica.
- **Autorização**: Livre acesso (não requer autenticação).

**Path Parameters**:

- `id` (UUID): ID da categoria.

**Responses**:

- **200 OK** – Categoria encontrada.
- **404 Not Found** – Categoria não encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Categoria obtida com sucesso",
  "data": {
    "id": "b13c2749-9954-4414-a41a-8f73e41b21ad",
    "storeId": "2abf13c3-cd94-4659-9130-2a3a70d993b9",
    "name": "Roupas",
    "createdAt": "2025-10-19T09:00:00.000",
    "updatedAt": "2025-10-19T09:00:00.000"
  },
  "errors": null
}
```

---

## **Atualizar Categoria**

- **Endpoint**: `PATCH /api/categories/{id}`
- **Objetivo**: Atualizar os dados de uma categoria existente.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID da categoria.

**Request Body** (campos opcionais):

```json
{
  "name": "Eletrônicos e Gadgets"
}
```

**Responses**:

- **200 OK** – Categoria atualizada com sucesso.
- **404 Not Found** – Categoria não encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "id": "21f1b8e4-2f17-43f7-9b32-1b6d013ea056",
    "storeId": "d4b1fa40-1c72-4c60-9f9c-bbc92bdb8a5b",
    "name": "Eletrônicos e Gadgets",
    "createdAt": "2025-10-19T08:00:00.000",
    "updatedAt": "2025-10-19T11:10:00.000"
  },
  "errors": null
}
```

---

## **Excluir Categoria**

- **Endpoint**: `DELETE /api/categories/{id}`
- **Objetivo**: Excluir uma categoria existente.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID da categoria.

**Responses**:

- **200 OK** – Categoria excluída com sucesso.
- **404 Not Found** – Categoria não encontrada.
