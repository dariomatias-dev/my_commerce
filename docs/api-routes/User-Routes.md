# **Usuários** (`/api/users/*`)

Conjunto de endpoints para gerenciamento das operações relacionadas aos usuários do sistema.

## Funcionalidades

- **GET /api/users** – Listar todos os usuários com paginação (somente para administradores).
- **GET /api/users/{id}** – Obter detalhes de um usuário específico (somente para administradores).
- **PATCH /api/users/{id}** – Atualizar dados de um usuário específico (somente para administradores).
- **DELETE /api/users/{id}** – Deletar um usuário específico (somente para administradores).
- **GET /api/users/me** – Consultar dados do próprio usuário autenticado.
- **PATCH /api/users/me** – Atualizar dados do próprio usuário autenticado.
- **POST /api/users/me/change-password** – Alterar a senha do próprio usuário.
- **DELETE /api/users/me** – Deletar a própria conta.

Todos os endpoints de usuários utilizam o caminho base `/api/users/*` e seguem o padrão de resposta `ApiResponse<T>` para consistência e clareza.

---

## **Listar Usuários (Admin)**

- **Endpoint**: `GET /api/users`
- **Objetivo**: Obter uma lista paginada de todos os usuários.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Query Parameters**:

- `page` (opcional, default=0): Número da página.
- `size` (opcional, default=10): Quantidade de usuários por página.

**Responses**:

- **200 OK**: Retorna a lista de usuários paginada.

---

## **Obter Usuário por ID (Admin)**

- **Endpoint**: `GET /api/users/{id}`
- **Objetivo**: Obter detalhes de um usuário específico pelo ID.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Path Parameters**:

- `id` (UUID): ID do usuário.

**Responses**:

- **200 OK**: Usuário encontrado e retornado.
- **404 Not Found**: Usuário não encontrado.

---

## **Atualizar Usuário por ID (Admin)**

- **Endpoint**: `PATCH /api/users/{id}`
- **Objetivo**: Atualizar dados de um usuário existente.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Request Body**:

```json
{
  "name": "Nome Atualizado"
}
```

**Responses**:

- **200 OK**: Usuário atualizado com sucesso.
- **404 Not Found**: Usuário não encontrado.

---

## **Deletar Usuário por ID (Admin)**

- **Endpoint**: `DELETE /api/users/{id}`
- **Objetivo**: Deletar um usuário específico.
- **Autorização**: Administradores (`ROLE_ADMIN`).

**Responses**:

- **200 OK**: Usuário deletado com sucesso.
- **404 Not Found**: Usuário não encontrado.

---

## **Obter Usuário Atual**

- **Endpoint**: `GET /api/users/me`
- **Objetivo**: Obter os dados do usuário autenticado.
- **Autorização**: Qualquer usuário autenticado.

**Responses**:

- **200 OK**: Retorna os dados do usuário atual.

---

## **Atualizar Usuário Atual**

- **Endpoint**: `PATCH /api/users/me`
- **Objetivo**: Atualizar os próprios dados do usuário autenticado.
- **Autorização**: Qualquer usuário autenticado.

**Request Body**:

```json
{
  "name": "Novo Nome"
}
```

**Responses**:

- **200 OK**: Dados atualizados com sucesso.

---

## **Alterar Senha do Usuário Atual**

- **Endpoint**: `POST /api/users/me/change-password`
- **Objetivo**: Alterar a senha do usuário autenticado.
- **Autorização**: Qualquer usuário autenticado.

**Request Body**:

```json
{
  "currentPassword": "SenhaAtual123!",
  "newPassword": "NovaSenha123!"
}
```

**Responses**:

- **200 OK**: Senha atualizada com sucesso.
- **400 Bad Request**: Senha atual incorreta.

---

## **Deletar Usuário Atual**

- **Endpoint**: `DELETE /api/users/me`
- **Objetivo**: Deletar a própria conta.
- **Autorização**: Qualquer usuário autenticado.

**Responses**:

- **200 OK**: Conta deletada com sucesso.
