# FinLearn Backend - FIAP

Backend em Java Spring Boot para a fintech FinLearn.

## Tecnologias

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Oracle Database FIAP

## Estrutura

```text
src/main/java/br/com/fiap/finlearn
├── controller
├── exception
├── model
├── repository
├── service
└── FinlearnApplication.java
```

## Entidades implementadas

- Usuario
- Conta
- Transacao
- Pix
- Investimento
- MetaFinanceira

Todas possuem:

- Model/Entity
- Repository JPA
- Service com regra de negócio
- RestController com GET, POST, PUT e DELETE

## Configurar Oracle FIAP

Abra o arquivo:

```text
src/main/resources/application.properties
```

Troque:

```properties
spring.datasource.username=SEU_RM
spring.datasource.password=SUA_SENHA
```

pelos seus dados da FIAP.

## Rodar o projeto

No IntelliJ, abra a pasta `finlearn-backend`, aguarde o Maven baixar as dependências e rode:

```text
FinlearnApplication.java
```

Ou pelo terminal:

```bash
mvn spring-boot:run
```

## Endpoints principais

```text
GET    /usuarios
POST   /usuarios
GET    /usuarios/{id}
PUT    /usuarios/{id}
DELETE /usuarios/{id}

GET    /contas
POST   /contas
GET    /contas/{id}
PUT    /contas/{id}
DELETE /contas/{id}

GET    /transacoes
POST   /transacoes
GET    /transacoes/{id}
PUT    /transacoes/{id}
DELETE /transacoes/{id}

GET    /pix
POST   /pix
GET    /pix/{id}
PUT    /pix/{id}
DELETE /pix/{id}

GET    /investimentos
POST   /investimentos
GET    /investimentos/{id}
PUT    /investimentos/{id}
DELETE /investimentos/{id}

GET    /metas
POST   /metas
GET    /metas/{id}
PUT    /metas/{id}
PUT    /metas/{id}/adicionar-valor?valor=100
DELETE /metas/{id}
```

## Exemplos de JSON

### POST /usuarios

```json
{
  "nome": "Thiago Santos",
  "cpf": "12345678900",
  "email": "thiago@finlearn.com",
  "senha": "123456",
  "telefone": "11999999999"
}
```

### POST /contas

```json
{
  "numeroConta": 1001,
  "saldo": 2850.90,
  "tipoConta": "CORRENTE",
  "limite": 500.00,
  "rendimento": 0,
  "usuario": { "id": 1 }
}
```

### POST /transacoes

```json
{
  "descricao": "Pagamento de mercado",
  "valor": 320.50,
  "tipoTransacao": "SAIDA",
  "origem": "Conta Corrente",
  "contaOrigem": "1001",
  "contaDestino": "Mercado",
  "usuario": { "id": 1 }
}
```

### POST /pix

```json
{
  "valor": 450.00,
  "tipoPix": "ENTRADA",
  "chavePix": "thiago@finlearn.com",
  "contaOrigem": "Banco externo",
  "contaDestino": "1001",
  "usuario": { "id": 1 }
}
```

### POST /investimentos

```json
{
  "tipoInvestimento": "Tesouro Direto",
  "valor": 500.00,
  "rentabilidade": 12.5,
  "usuario": { "id": 1 }
}
```

### POST /metas

```json
{
  "titulo": "Reserva de emergência",
  "descricao": "Guardar dinheiro para emergências",
  "valorObjetivo": 5000.00,
  "valorAtual": 1200.00,
  "dataLimite": "2026-12-31",
  "pontosRecompensa": 100,
  "usuario": { "id": 1 }
}
```
