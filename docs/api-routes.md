# Rotas da API

Documentação de todos os endpoints disponíveis na API, organizados por grupo funcional.
Cada conjunto de rotas inclui informações sobre objetivo, parâmetros de entrada, exemplos de request/response e códigos de status retornados.
O objetivo é fornecer uma referência clara e completa para desenvolvedores que integram ou mantêm o sistema, garantindo consistência, segurança e facilidade de uso.

## **Autenticação** (`/api/auth`)

O conjunto de endpoints de autenticação gerencia o acesso dos usuários ao sistema.  
Ele fornece funcionalidades para:

- Autenticar usuários e fornecer tokens JWT de acesso.
- Registrar novos usuários e armazenar informações básicas de perfil.
- Verificar e validar endereços de e-mail após cadastro.
- Reenviar e-mails de verificação para usuários não confirmados.
- Solicitar e executar a recuperação de senha.
- Resetar a senha de usuários mediante token válido.
- Renovar tokens JWT de acesso utilizando refresh tokens.

Todos os endpoints de autenticação utilizam o caminho base `/api/auth` e seguem padrões de request/response consistentes, garantindo segurança, rastreabilidade e clareza no fluxo de autenticação.

---

### **Login**
- **Endpoint**: `POST /api/auth/login`  
- **Objetivo**: Autenticar o usuário com suas credenciais.

**Request Body**:

```json
{
  "email": "johndoe@gmail.com",
  "password": "StrongPass123!"
}
```

**Responses**:

* **200 OK**: Retorna um token JWT válido.
* **401 Unauthorized**: E-mail ou senha incorretos.

---

### **Cadastro de Usuário (Signup)**

* **Endpoint**: `POST /api/auth/signup`
* **Objetivo**: Registrar um novo usuário no sistema.

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "StrongPass123!"
}
```

**Responses**:

* **201 Created**: Usuário registrado com sucesso.
* **400 Bad Request**: Dados inválidos ou e-mail já registrado.
* **409 Conflict**: O e-mail informado já está em uso.

---

### **Verificação de E-mail**

* **Endpoint**: `POST /api/auth/verify-email`
* **Objetivo**: Verificar o e-mail do usuário após o cadastro.

**Request Body**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Responses**:

* **200 OK**: E-mail verificado com sucesso.
* **400 Bad Request**: Token inválido ou expirado.

---

### **Reenvio de E-mail de Verificação**

* **Endpoint**: `POST /api/auth/resend-verification-email`
* **Objetivo**: Reenviar o e-mail de verificação para o usuário.

**Request Body**:

```json
{
  "email": "johndoe@gmail.com"
}
```

**Responses**:

* **200 OK**: E-mail de verificação reenviado com sucesso.
* **404 Not Found**: E-mail não encontrado.

---

### **Recuperação de Senha**

* **Endpoint**: `POST /api/auth/recover-password`
* **Objetivo**: Solicitar recuperação de senha, enviando um link para o e-mail informado.

**Request Body**:

```json
{
  "email": "johndoe@gmail.com"
}
```

**Responses**:

* **200 OK**: E-mail de recuperação enviado com sucesso.
* **404 Not Found**: E-mail não encontrado.

---

### **Resetar Senha**

* **Endpoint**: `POST /api/auth/reset-password`
* **Objetivo**: Resetar a senha do usuário.

**Request Body**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "StrongPass123!"
}
```

**Responses**:

* **200 OK**: Operação realizada com sucesso.
* **400 Bad Request**: Token inválido ou expirado.

---

### **Renovação de Tokens**

* **Endpoint**: `POST /api/auth/refresh-token`
* **Objetivo**: Renovar os tokens JWT do usuário.

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Responses**:

* **200 OK**: Token renovado com sucesso.
* **401 Unauthorized**: Token inválido ou expirado.
