# API Flowchart

Este fluxograma resume o fluxo principal da aplicacao e os caminhos exigidos no desafio.

```mermaid
flowchart TD
    A[Cliente ou Front-end] --> B[POST /auth/login]
    B --> C{Credenciais validas?}
    C -->|Nao| D[401 Unauthorized]
    C -->|Sim| E[JWT]

    E --> F[Endpoints /messages protegidos por JwtAuthGuard]

    subgraph API[Messages API]
        F --> G[ValidationPipe valida DTOs]
        G --> H{Qual endpoint foi chamado?}

        H --> I[POST /messages]
        I --> J[CreateMessageUseCase]
        J --> K[Cria mensagem com status SENT]
        K --> L[MessageRepository]
        L --> M[(DynamoDB)]
        M --> N[201 Created]

        H --> O[GET /messages/:id]
        O --> P[GetMessageByIdUseCase]
        P --> L
        P --> Q{Mensagem encontrada?}
        Q -->|Nao| R[404 Not Found]
        Q -->|Sim| S[200 OK]

        H --> T[GET /messages]
        T --> U[SearchMessagesUseCase]
        U --> V{Filtros informados}
        V -->|sender| W[findBySender]
        V -->|startDate + endDate| X[findByPeriod]
        V -->|sender + periodo| Y[findBySenderAndPeriod]
        W --> L
        X --> L
        Y --> L
        L --> Z[200 OK com lista]

        H --> AA[PATCH /messages/:id/status]
        AA --> AB[UpdateMessageStatusUseCase]
        AB --> AC[Busca mensagem atual]
        AC --> L
        AB --> AD{Transicao valida?}
        AD -->|Nao| AE[400 Bad Request]
        AD -->|Sim| AF[Atualiza status]
        AF --> L
        AF --> AG[200 OK]
    end

    N --> AH[LoggingInterceptor + Winston]
    S --> AH
    Z --> AH
    AG --> AH
    D --> AI[GlobalExceptionFilter]
    R --> AI
    AE --> AI
```

## Regra de status

```mermaid
flowchart LR
    A[SENT] --> B[RECEIVED]
    B --> C[READ]
```

## Leitura rapida para avaliacao

- `POST /messages` sempre cria a mensagem com status inicial `SENT`.
- `PATCH /messages/:id/status` respeita a regra `SENT -> RECEIVED -> READ`.
- `GET /messages` aceita busca por remetente, por periodo, ou a combinacao dos dois filtros.
- Persistencia e consultas sao resolvidas via `MessageRepository`, mantendo a aplicacao desacoplada do banco.
