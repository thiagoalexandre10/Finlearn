# FinLearn Frontend Reorganizado

Projeto React/Vite com SPA, componentização, rotas, autenticação visual/local, integração com backend Spring Boot via API REST e fallback local para testes.

## Rodar o projeto

```powershell
cd C:\Users\Th\Downloads\finlearn-frontend-reorganizado\finlearn-frontend-reorganizado
npm.cmd install
npm.cmd run dev
```

Crie um arquivo `.env` na raiz com:

```env
VITE_API_URL=http://localhost:8080
```

## Login de teste

- CPF/e-mail: `thiago3312188@finlearn.com` ou `1234563312188`
- Senha: `123456`

## Observações

- Pix, investimentos, metas, transações, notificações, ranking e relatórios usam cache local para não quebrar quando o backend/Oracle estiver fora.
- Quando o backend está ativo, o projeto tenta sincronizar com `/contas`, `/transacoes`, `/investimentos`, `/metas`, `/pix/enviar`, `/usuarios`.
