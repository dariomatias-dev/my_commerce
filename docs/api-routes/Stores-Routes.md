# **Lojas** (`/api/stores/*`)

Conjunto de endpoints responsáveis pelo **gerenciamento das lojas** no sistema.
Permitem que usuários autenticados (assinantes e administradores) **criem, visualizem, atualizem e excluam** suas lojas.

Cada loja possui informações visuais (banner, logo, cor-tema) e dados de controle de status (`isActive`).

---

## **Funcionalidades**

- **Criar loja** – Cria uma nova loja vinculada ao usuário autenticado.
- **Listar lojas** – Lista todas as lojas visíveis para o usuário autenticado.
- **Obter loja por ID** – Retorna os detalhes de uma loja específica.
- **Obter loja por slug** – Retorna os detalhes de uma loja a partir de seu identificador público.
- **Atualizar loja** – Atualiza parcialmente os dados de uma loja existente.
- **Excluir loja** – Remove uma loja existente do sistema.

Todos os endpoints utilizam o caminho base `/api/stores/*` e seguem o padrão de resposta `ApiResponse<T>` para consistência e clareza.

---

## **Criar Loja**

- **Endpoint**: `POST /api/stores`
- **Objetivo**: Criar uma nova loja vinculada ao usuário autenticado.
- **Autorização**: `ROLE_ADMIN`, `ROLE_SUBSCRIBER`

**Request Body**:

```json
{
  "name": "Minha Loja",
  "description": "Loja especializada em produtos de tecnologia.",
  "bannerUrl": "https://meusite.com/banner.jpg",
  "logoUrl": "https://meusite.com/logo.png",
  "themeColor": "#1E90FF",
  "isActive": true
}
```

**Responses**:

- **200 OK** – Loja criada com sucesso.
- **400 Bad Request** – Dados inválidos ou nome já existente.
- **404 Not Found** – Proprietário não encontrado.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Loja criada com sucesso",
  "data": {
    "id": "bfe2a60d-7d32-46f2-8f69-2bb1e9a9b845",
    "name": "Minha Loja",
    "slug": "minha-loja",
    "description": "Loja especializada em produtos de tecnologia.",
    "bannerUrl": "https://meusite.com/banner.jpg",
    "logoUrl": "https://meusite.com/logo.png",
    "themeColor": "#1E90FF",
    "isActive": true,
    "ownerId": "9f5c0b8a-3c14-4e9a-9c5c-56e1ab2a912a",
    "createdAt": "2025-10-18T17:43:08.68825",
    "updatedAt": "2025-10-18T17:43:08.688274"
  },
  "errors": null
}
```

---

## **Listar Lojas**

- **Endpoint**: `GET /api/stores`
- **Objetivo**: Listar as lojas visíveis para o usuário autenticado.
- **Autorização**: `ROLE_ADMIN`, `ROLE_SUBSCRIBER`

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de usuários por página.

**Responses**:

- **200 OK** – Retorna lista paginada de lojas.
- **204 No Content** – Nenhuma loja encontrada.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Lojas obtidas com sucesso",
  "data": {
    "content": [
      {
        "id": "bfe2a60d-7d32-46f2-8f69-2bb1e9a9b845",
        "name": "Minha Loja",
        "slug": "minha-loja",
        "description": "Loja especializada em produtos de tecnologia.",
        "bannerUrl": "https://meusite.com/banner.jpg",
        "logoUrl": "https://meusite.com/logo.png",
        "themeColor": "#1E90FF",
        "isActive": true,
        "ownerId": "9f5c0b8a-3c14-4e9a-9c5c-56e1ab2a912a",
        "createdAt": "2025-10-18T17:43:08.68825",
        "updatedAt": "2025-10-18T17:43:08.688274"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 1,
      "sort": {
        "sorted": false,
        "unsorted": true,
        "empty": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 1,
    "totalElements": 1,
    "last": true,
    "first": true,
    "size": 1,
    "number": 0,
    "sort": {
      "sorted": false,
      "unsorted": true,
      "empty": true
    },
    "numberOfElements": 1,
    "empty": false
  },
  "errors": null
}
```

---

## **Obter Loja por ID**

- **Endpoint**: `GET /api/stores/{id}`
- **Objetivo**: Obter detalhes de uma loja pelo seu ID.
- **Autorização**: `ROLE_ADMIN`, `ROLE_SUBSCRIBER`

**Path Parameters**:

- `id` (UUID): ID da loja.

**Responses**:

- **200 OK** – Loja encontrada.
- **404 Not Found** – Loja não encontrada ou não pertence ao usuário autenticado.

**Exemplo de Resposta**:

```json
{
  "success": true,
  "message": "Loja obtida com sucesso.",
  "data": {
    "id": "bfe2a60d-7d32-46f2-8f69-2bb1e9a9b845",
    "name": "Minha Loja",
    "slug": "minha-loja",
    "description": "Loja especializada em produtos de tecnologia.",
    "bannerUrl": "https://meusite.com/banner.jpg",
    "logoUrl": "https://meusite.com/logo.png",
    "themeColor": "#1E90FF",
    "isActive": true,
    "ownerId": "9f5c0b8a-3c14-4e9a-9c5c-56e1ab2a912a",
    "createdAt": "2025-10-18T17:43:08.68825",
    "updatedAt": "2025-10-18T17:43:08.688274"
  },
  "errors": null
}
```

---

## **Obter Loja por Slug**

- **Endpoint**: `GET /api/stores/slug/{slug}`
- **Objetivo**: Obter detalhes de uma loja pública pelo seu `slug`.
- **Autorização**: `ROLE_ADMIN`, `ROLE_SUBSCRIBER` (pode ser aberto futuramente)

**Path Parameters**:

- `slug` (string): identificador público da loja.

**Responses**:

- **200 OK** – Loja encontrada.
- **404 Not Found** – Loja não encontrada.

---

## **Atualizar Loja**

- **Endpoint**: `PATCH /api/stores/{id}`
- **Objetivo**: Atualizar parcialmente os dados de uma loja existente.
- **Autorização**: `ROLE_ADMIN`, `ROLE_SUBSCRIBER`

**Path Parameters**:

- `id` (UUID): ID da loja.

**Request Body** (campos opcionais):

```json
{
  "name": "Minha Loja",
  "description": "Loja especializada em produtos de tecnologia.",
  "bannerUrl": "https://meusite.com/banner.jpg",
  "logoUrl": "https://meusite.com/logo.png",
  "themeColor": "#1E90FF",
  "isActive": true
}
```

**Responses**:

- **200 OK** – Loja atualizada com sucesso.
- **404 Not Found** – Loja não encontrada.
- **403 Forbidden** – Usuário sem permissão.

---

## **Excluir Loja**

- **Endpoint**: `DELETE /api/stores/{id}`
- **Objetivo**: Excluir uma loja existente.
- **Autorização**: `ROLE_ADMIN`, `ROLE_SUBSCRIBER`

**Path Parameters**:

- `id` (UUID): ID da loja.

**Responses**:

- **200 OK** – Loja excluída com sucesso.
- **404 Not Found** – Loja não encontrada.
- **403 Forbidden** – Usuário não tem permissão para excluir esta loja.
