# **Autenticação** (`/api/auth/*`)

Conjunto de endpoints de autenticação para gerenciamento do acesso dos usuários ao sistema.

## Funcionalidades

- **Login** – Autenticar usuários e fornecer tokens JWT.
- **Signup** – Registrar novos usuários.
- **Verify Email** – Confirmar e validar endereços de e-mail.
- **Resend Verification Email** – Reenviar e-mail de verificação para usuários não confirmados.
- **Recover Password** – Solicitar recuperação de senha.
- **Reset Password** – Resetar senha mediante token válido.
- **Refresh Token** – Renovar tokens JWT de acesso.

Todos os endpoints de autenticação utilizam o caminho base `/api/auth/*` e seguem o padrão de resposta `ApiResponse<T>` para consistência e clareza.

---

## **Login**

- **Endpoint**: `POST /api/auth/login`
- **Objetivo**: Autenticar o usuário com suas credenciais.
- **Autorização**: Livre acesso (não requer autenticação).

**Request Body**:

```json
{
  "email": "johndoe@gmail.com",
  "password": "StrongPass123!"
}
```

**Responses**:

- **200 OK**: Retorna um token JWT válido.
- **401 Unauthorized**: E-mail ou senha incorretos.

---

## **Cadastro de Usuário (Signup)**

- **Endpoint**: `POST /api/auth/signup`
- **Objetivo**: Registrar um novo usuário no sistema.
- **Autorização**: Livre acesso (não requer autenticação).

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "StrongPass123!"
}
```

**Responses**:

- **201 Created**: Usuário registrado com sucesso.
- **400 Bad Request**: Dados inválidos ou e-mail já registrado.
- **409 Conflict**: O e-mail informado já está em uso.

---

## **Verificação de E-mail**

- **Endpoint**: `POST /api/auth/verify-email`
- **Objetivo**: Verificar o e-mail do usuário após o cadastro.
- **Autorização**: Livre acesso (não requer autenticação).

**Request Body**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Responses**:

- **200 OK**: E-mail verificado com sucesso.
- **400 Bad Request**: Token inválido ou expirado.

---

## **Reenvio de E-mail de Verificação**

- **Endpoint**: `POST /api/auth/resend-verification-email`
- **Objetivo**: Reenviar o e-mail de verificação para o usuário.
- **Autorização**: Livre acesso (não requer autenticação).

**Request Body**:

```json
{
  "email": "johndoe@gmail.com"
}
```

**Responses**:

- **200 OK**: E-mail de verificação reenviado com sucesso.
- **404 Not Found**: E-mail não encontrado.

---

## **Recuperação de Senha**

- **Endpoint**: `POST /api/auth/recover-password`
- **Objetivo**: Solicitar recuperação de senha, enviando um link para o e-mail informado.
- **Autorização**: Qualquer usuário autenticado.

**Request Body**:

```json
{
  "email": "johndoe@gmail.com"
}
```

**Responses**:

- **200 OK**: E-mail de recuperação enviado com sucesso.
- **404 Not Found**: E-mail não encontrado.

---

## **Resetar Senha**

- **Endpoint**: `POST /api/auth/reset-password`
- **Objetivo**: Resetar a senha do usuário.
- **Autorização**: Qualquer usuário autenticado.

**Request Body**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "StrongPass123!"
}
```

**Responses**:

- **200 OK**: Operação realizada com sucesso.
- **400 Bad Request**: Token inválido ou expirado.

---

## **Renovação de Tokens**

- **Endpoint**: `POST /api/auth/refresh-token`
- **Objetivo**: Renovar os tokens JWT do usuário.
- **Autorização**: Qualquer usuário autenticado.

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Responses**:

- **200 OK**: Token renovado com sucesso.
- **401 Unauthorized**: Token inválido ou expirado.
