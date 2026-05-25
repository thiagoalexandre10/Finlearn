# FinLearn Frontend Integrado

Frontend React SPA integrado ao backend Spring Boot do projeto FinLearn.

## Como rodar

```powershell
npm.cmd install
npm.cmd run dev
```

Se o Vite abrir em `http://localhost:5174`, libere essa porta no CORS do backend.

## Backend esperado

O backend deve estar rodando em:

```text
http://localhost:8080
```

Endpoints usados:

- `/usuarios`
- `/contas`
- `/transacoes`
- `/investimentos`
- `/metas`
- `/pix`

## CORS no Spring Boot

```java
.allowedOrigins(
    "http://localhost:5173",
    "http://localhost:5174"
)
```

## O que está integrado

- Metas: GET, POST, PUT e DELETE.
- Contas: GET, POST, PUT e DELETE.
- Transações: GET, POST, PUT e DELETE.
- Investimentos: GET, POST, PUT e DELETE.
- Pix: GET e POST.
- Usuários: GET, POST, PUT e DELETE.

As telas possuem fallback visual para quando o backend estiver fora do ar, mas exibem aviso de erro quando a API falha.
