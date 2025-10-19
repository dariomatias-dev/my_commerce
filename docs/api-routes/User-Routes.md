# **Usuários** (`/api/users/*`)

Conjunto de endpoints responsáveis pelo **gerenciamento dos usuários**.

## **Funcionalidades**

- **Listar usuários** (`GET /api/users`) – Lista todos os usuários com paginação (restrito a administradores).
- **Obter usuário por ID** (`GET /api/users/{id}`) – Retorna os detalhes de um usuário específico (restrito a administradores).
- **Atualizar usuário por ID** (`PATCH /api/users/{id}`) – Atualiza os dados de um usuário específico (restrito a administradores).
- **Excluir usuário por ID** (`DELETE /api/users/{id}`) – Remove um usuário específico do sistema (restrito a administradores).
- **Consultar próprio usuário** (`GET /api/users/me`) – Retorna os dados do usuário autenticado.
- **Atualizar próprio usuário** (`PATCH /api/users/me`) – Atualiza os dados do usuário autenticado.
- **Alterar senha própria** (`POST /api/users/me/change-password`) – Permite alterar a senha do usuário autenticado.
- **Excluir própria conta** (`DELETE /api/users/me`) – Remove a própria conta do sistema.

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
