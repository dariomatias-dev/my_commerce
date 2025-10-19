# **Assinaturas** (`/api/subscriptions/*`)

Conjunto de endpoints responsáveis pelo **gerenciamento de assinaturas**.
Permitem que assinantes e administradores **criem, visualizem, atualizem e excluam** assinaturas vinculadas a planos de assinatura e usuários específicos.

Cada assinatura está associada a um **usuário** e a um **plano de assinatura**, possuindo datas de início e fim, além de indicar se está ativa.

---

## **Funcionalidades**

- **Criar assinatura** – Cria uma nova assinatura vinculada a um usuário e a um plano.
- **Listar assinaturas** – Lista todas as assinaturas do sistema (restrito a administradores).
- **Listar assinaturas por usuário** – Retorna assinaturas específicas de um usuário.
- **Obter assinatura por ID** – Retorna os detalhes de uma assinatura específica.
- **Atualizar assinatura** – Atualiza os dados de uma assinatura existente.
- **Excluir assinatura** – Remove uma assinatura existente do sistema (restrito a administradores).

Todos os endpoints utilizam o caminho base `/api/subscriptions/*` e seguem o padrão de resposta `ApiResponse<T>`.

---

## **Criar Assinatura**

- **Endpoint**: `POST /api/subscriptions`
- **Objetivo**: Criar uma nova assinatura para um usuário.
- **Autorização**: Qualquer usuário autenticado.

**Request Body**:

```json
{
  "userId": "e4a1f8d2-6b23-4b1a-9c12-1d4f0f9c7e21",
  "planId": "a1c2d3e4-5678-90ab-cdef-1234567890ab",
  "startDate": "2025-10-20T00:00:00",
  "endDate": "2025-11-20T00:00:00",
  "isActive": true
}
```

**Responses**:

- **200 OK** – Assinatura criada com sucesso.
- **404 Not Found** – Usuário ou plano não encontrado.
- **400 Bad Request** – Dados inválidos.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Assinatura criada com sucesso",
  "data": {
    "id": "f3b2c1d4-5678-90ab-cdef-1234567890ef",
    "userId": "e4a1f8d2-6b23-4b1a-9c12-1d4f0f9c7e21",
    "planId": "a1c2d3e4-5678-90ab-cdef-1234567890ab",
    "startDate": "2025-10-20T00:00:00",
    "endDate": "2025-11-20T00:00:00",
    "isActive": true,
    "createdAt": "2025-10-19T07:26:42.596896",
    "updatedAt": "2025-10-19T07:26:42.596924"
  },
  "errors": null
}
```

---

## **Listar Assinaturas**

- **Endpoint**: `GET /api/subscriptions`
- **Objetivo**: Listar todas as assinaturas do sistema (restrito a administradores).
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de assinaturas por página.

**Responses**:

- **200 OK** – Retorna lista paginada de assinaturas.
- **204 No Content** – Nenhuma assinatura encontrada.

---

## **Listar Assinaturas por Usuário**

- **Endpoint**: `GET /api/subscriptions/user/{userId}`
- **Objetivo**: Listar todas as assinaturas de um usuário específico.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `userId` (UUID): ID do usuário.

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de assinaturas por página.

**Responses**:

- **200 OK** – Assinaturas do usuário retornadas com sucesso.
- **404 Not Found** – Usuário não encontrado.

---

## **Obter Assinatura por ID**

- **Endpoint**: `GET /api/subscriptions/{id}`
- **Objetivo**: Obter os detalhes de uma assinatura específica.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID da assinatura.

**Responses**:

- **200 OK** – Assinatura encontrada.
- **404 Not Found** – Assinatura não encontrada.

---

## **Atualizar Assinatura**

- **Endpoint**: `PATCH /api/subscriptions/{id}`
- **Objetivo**: Atualizar os dados de uma assinatura existente.
- **Autorização**: Assinantes (`ROLE_SUBSCRIBER`) e Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID da assinatura.

**Request Body** (campos opcionais):

```json
{
  "startDate": "2025-10-20T00:00:00",
  "endDate": "2025-11-20T00:00:00",
  "isActive": true
}
```

**Responses**:

- **200 OK** – Assinatura atualizada com sucesso.
- **404 Not Found** – Assinatura não encontrada.
- **403 Forbidden** – Usuário não tem permissão para editar esta assinatura.

---

## **Excluir Assinatura**

- **Endpoint**: `DELETE /api/subscriptions/{id}`
- **Objetivo**: Excluir uma assinatura existente.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID da assinatura.

**Responses**:

- **200 OK** – Assinatura excluída com sucesso.
- **404 Not Found** – Assinatura não encontrada.
- **403 Forbidden** – Usuário não tem permissão para excluir esta assinatura.
