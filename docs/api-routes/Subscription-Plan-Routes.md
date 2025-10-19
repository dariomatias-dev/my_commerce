# **Planos de Assinatura** (`/api/subscription-plans/*`)

Conjunto de endpoints responsáveis pelo **gerenciamento de planos de assinatura**.
Permitem que administradores **criem, visualizem, atualizem e excluam** planos de assinatura, definindo limites e recursos para usuários assinantes.

Cada plano possui **nome, preço, limites de lojas e produtos**, além de **recursos opcionais**.

---

## **Funcionalidades**

- **Criar plano de assinatura** – Cria um novo plano com limites e recursos definidos.
- **Listar planos de assinatura** – Lista todos os planos disponíveis.
- **Obter plano por ID** – Retorna os detalhes de um plano específico.
- **Atualizar plano de assinatura** – Atualiza os dados de um plano existente.
- **Excluir plano de assinatura** – Remove um plano existente do sistema.

Todos os endpoints utilizam o caminho base `/api/subscription-plans/*` e seguem o padrão de resposta `ApiResponse<T>`.

---

## **Criar Plano de Assinatura**

- **Endpoint**: `POST /api/subscription-plans`
- **Objetivo**: Criar um novo plano de assinatura.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Request Body**:

```json
{
  "name": "Plano Premium",
  "maxStores": 3,
  "maxProducts": 100,
  "features": "Suporte prioritário, relatórios avançados",
  "price": 49.9
}
```

**Responses**:

- **200 OK** – Plano criado com sucesso.
- **400 Bad Request** – Dados inválidos.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Plano criado com sucesso",
  "data": {
    "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    "name": "Plano Premium",
    "maxStores": 3,
    "maxProducts": 100,
    "features": "Suporte prioritário, relatórios avançados",
    "price": 49.9,
    "createdAt": "2025-10-19T08:30:00.000",
    "updatedAt": "2025-10-19T08:30:00.000"
  },
  "errors": null
}
```

---

## **Listar Planos de Assinatura**

- **Endpoint**: `GET /api/subscription-plans`
- **Objetivo**: Listar todos os planos disponíveis (paginados).
- **Autorização**: Livre acesso (não requer autenticação).

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de planos por página.

**Responses**:

- **200 OK** – Lista paginada de planos.
- **204 No Content** – Nenhum plano encontrado.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Planos obtidos com sucesso",
  "data": {
    "content": [
      {
        "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
        "name": "Plano Premium",
        "maxStores": 3,
        "maxProducts": 100,
        "features": "Suporte prioritário, relatórios avançados",
        "price": 49.9,
        "createdAt": "2025-10-19T08:30:00.000",
        "updatedAt": "2025-10-19T08:30:00.000"
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

## **Obter Plano por ID**

- **Endpoint**: `GET /api/subscription-plans/{id}`
- **Objetivo**: Obter os detalhes de um plano específico.
- **Autorização**: Livre acesso (não requer autenticação).

**Path Parameters**:

- `id` (UUID): ID do plano.

**Responses**:

- **200 OK** – Plano encontrado.
- **404 Not Found** – Plano não encontrado.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Plano obtido com sucesso",
  "data": {
    "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    "name": "Plano Premium",
    "maxStores": 3,
    "maxProducts": 100,
    "features": "Suporte prioritário, relatórios avançados",
    "price": 49.9,
    "createdAt": "2025-10-19T08:30:00.000",
    "updatedAt": "2025-10-19T08:30:00.000"
  },
  "errors": null
}
```

---

## **Atualizar Plano de Assinatura**

- **Endpoint**: `PATCH /api/subscription-plans/{id}`
- **Objetivo**: Atualizar os dados de um plano existente.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID do plano.

**Request Body** (campos opcionais):

```json
{
  "name": "Plano Premium Plus",
  "maxStores": 5,
  "maxProducts": 200,
  "features": "Suporte prioritário, relatórios avançados, integração API",
  "price": 79.9
}
```

**Responses**:

- **200 OK** – Plano atualizado com sucesso.
- **404 Not Found** – Plano não encontrado.

**Exemplo de Resposta**:

```json
{
  "status": "success",
  "code": 200,
  "message": "Plano atualizado com sucesso",
  "data": {
    "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    "name": "Plano Premium Plus",
    "maxStores": 5,
    "maxProducts": 200,
    "features": "Suporte prioritário, relatórios avançados, integração API",
    "price": 79.9,
    "createdAt": "2025-10-19T08:30:00.000",
    "updatedAt": "2025-10-19T10:15:00.000"
  },
  "errors": null
}
```

---

## **Excluir Plano de Assinatura**

- **Endpoint**: `DELETE /api/subscription-plans/{id}`
- **Objetivo**: Excluir um plano existente.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID do plano.

**Responses**:

- **200 OK** – Plano excluído com sucesso.
- **404 Not Found** – Plano não encontrado.
