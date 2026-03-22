# 📩 Messages API

<p align="center">
  API RESTful para gerenciamento de mensagens com foco em arquitetura limpa, escalabilidade e boas práticas.
</p>

---

## 🚀 Tecnologias

- Node.js
- NestJS
- TypeScript
- AWS DynamoDB
- Docker
- Jest
- Winston (logging estruturado)
---

## 🧠 Arquitetura

O projeto foi estruturado seguindo princípios de:

- Clean Architecture
- Separation of Concerns
- Ports and Adapters (Hexagonal Architecture)

### 📁 Estrutura

```
src/
├── core/                # Regras de negócio (domínio + aplicação)
│   ├── domain/
│   └── application/
├── infrastructure/      # HTTP, banco de dados, logging
├── common/              # Middlewares, interceptors, utils
```

### ✅ Benefícios

- Baixo acoplamento
- Alta testabilidade
- Independência de frameworks
- Facilidade de manutenção e evolução

---

## 🔐 Autenticação

A API utiliza autenticação via JWT.

### Endpoint

```
POST /auth/login
```

### Credenciais padrão

```json
{
  "username": "admin",
  "password": "admin123"
}
```

---

## 📦 Endpoints

### ➕ Criar mensagem

```
POST /messages
```

```json
{
  "content": "Hello world",
  "sender": "rafael"
}
```

---

### 🔍 Buscar mensagem por ID

```
GET /messages/:id
```

---

### 🔎 Buscar mensagens

```
GET /messages?sender=rafael
GET /messages?startDate=...&endDate=...
GET /messages?sender=rafael&startDate=...&endDate=...
```

---

### 🔄 Atualizar status

```
PATCH /messages/:id/status
```

```json
{
  "status": "READ"
}
```

---

## 📊 Modelagem no DynamoDB

A modelagem foi pensada para performance e escalabilidade.

### 🔑 Chaves

- `pk = MESSAGE#<id>`
- `sk = METADATA`

### 📈 Índices (GSI)

- `gsi1` → busca por remetente
  `SENDER#<sender>`

- `gsi2` → busca por período
  `MESSAGE`

---

## 🐳 Rodando localmente

### 1. Configurar ambiente

```bash
cp .env.local .env
```

### 2. Subir containers

```bash
docker compose up --build
```

### 3. Criar tabela DynamoDB

```bash
yarn dynamo:init
```

---

## ☁️ Usando AWS DynamoDB

### Configuração

```env
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=messages
```

> Remova `DYNAMODB_ENDPOINT` para usar DynamoDB real.

---

## 🔍 Observabilidade

A aplicação possui:

- Logging estruturado (Winston)
- Request ID por requisição
- Interceptor de tempo de resposta
- Global Exception Filter

### Exemplo de log

```json
{
  "requestId": "uuid",
  "path": "/messages",
  "durationMs": 12
}
```

---

## 🧪 Testes

Testes unitários cobrindo:

- Entidade de domínio (`Message`)
- Casos de uso:
  - CreateMessage
  - UpdateMessageStatus
  - SearchMessages
  - GetMessageById

### Rodar testes

```bash
yarn test
```

### Cobertura

```bash
yarn test:cov
```

---

## 🧠 Decisões Técnicas

### DynamoDB

Escolhido por:

- Alta escalabilidade
- Baixa latência
- Modelagem orientada a acesso

---

### Clean Architecture

Permite:

- Independência de frameworks
- Facilidade de testes
- Baixo acoplamento

---

### Testes

Priorizados testes unitários para:

- Garantir regras de negócio
- Validar comportamento da aplicação

---



## 👨‍💻 Autor

**Rafael Ribeiro**

---

## 🏁 Conclusão

Este projeto demonstra:

- Arquitetura limpa e bem estruturada
- Integração com AWS DynamoDB
- Boas práticas de backend
- Observabilidade
- Testabilidade