# Rotas da API

Documentação de todos os endpoints disponíveis na API, organizados por grupos funcionais.  
Cada grupo detalha objetivo, parâmetros de entrada, exemplos de request/response e códigos de status retornados.  
O objetivo é fornecer uma referência clara e completa para desenvolvedores que integram ou mantêm o sistema, garantindo consistência, segurança e facilidade de uso.

## Resposta Padrão

Todas as respostas da API seguem o padrão da classe `ApiResponse<T>`.  
Garantindo consistência, previsibilidade e clareza, alinhado às melhores práticas para APIs RESTful.

### Estrutura Geral

```json
{
  "status": "success | error",
  "code": 200,
  "message": "Descrição curta do resultado da operação",
  "data": {} | null,      // Presente apenas em respostas de sucesso
  "errors": [] | null      // Presente apenas em respostas de erro detalhado
}
```

**Campos:**

- `status`: resultado da operação (`success` ou `error`)
- `code`: código HTTP da resposta
- `message`: mensagem curta descrevendo o resultado ou motivo do erro
- `data`: objeto retornado em operações bem-sucedidas
- `errors`: lista detalhada de erros (tipo `FieldError`) para validações de campos ou falhas específicas

### Exemplos de Resposta

**Sucesso**

```json
{
  "status": "success",
  "code": 200,
  "message": "Usuário autenticado com sucesso",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "errors": null
}
```

**Erro simples**

```json
{
  "status": "error",
  "code": 401,
  "message": "E-mail ou senha incorretos",
  "data": null,
  "errors": null
}
```

**Erro detalhado**

```json
{
  "status": "error",
  "code": 400,
  "message": "Dados inválidos",
  "data": null,
  "errors": [
    { "field": "email", "error": "E-mail é obrigatório" },
    { "field": "password", "error": "Senha deve ter ao menos 8 caracteres" }
  ]
}
```

## Grupos de Rotas

As rotas da API estão organizadas em grupos funcionais, cada grupo com documentação dedicada aos seus endpoints:

- **Rotas de Autenticação**: [Authentication Routes](Authentication-Routes.md)
- **Rotas de Usuários**: [User Routes](User-Routes.md)
- **Rotas de Lojas**: [Store Routes](Store-Routes.md)
- **Rotas de Produtos**: [Product Routes](Product-Routes.md)
- **Rotas de Categorias**: [Category Routes](Category-Routes.md)
- **Rotas de Planos de Assinatura**: [Subscription Plan Routes](Subscription-Plan-Routes.md)
- **Rotas de Assinaturas**: [Subscription Routes](Subscription-Routes.md)
