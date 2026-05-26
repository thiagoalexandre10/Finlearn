# FinLearn Frontend Funcional

Projeto React/Vite componentizado, com rotas SPA, hooks, páginas por entidade do backend e consumo de API REST do Spring Boot.

## Como rodar

```powershell
npm.cmd install
npm.cmd run dev
```

Crie um arquivo `.env` na raiz com:

```env
VITE_API_URL=http://localhost:8080
```

## Backend esperado

O frontend busca estes endpoints no backend Java/Spring Boot:

- `GET/POST /contas`
- `GET/POST /transacoes`
- `GET/POST /investimentos`
- `GET/POST/PUT/DELETE /metas`
- `GET/POST /pix`
- `PUT /usuarios/{id}`

Se algum endpoint ainda não existir, a tela usa dados locais temporários para não quebrar a interface, mas os formulários já estão preparados para chamar o backend.

## Funções implementadas

- Login, registrar e esqueci senha com navegação.
- Dashboard fiel ao design verde do FinLearn.
- Botão Pix abre modal com chave Pix, valor, conta de origem e Pix no crédito quando existe cartão.
- Nova transação, transferência, nova conta, novo investimento e nova meta chamam o backend.
- Metas com criação, edição e exclusão.
- Configurações com troca de tema, cor principal e tamanho de fonte usando estado/localStorage.
- Layout responsivo para notebook e telas menores.
