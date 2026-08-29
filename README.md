# Ponto2Go

TCC do curso de Tecnologia em Banco de Dados da Fatec Bauru. O sistema simula uma rede de pontos de retirada (PUDOs) onde parceiros locais (papelaria, mercado, farmácia etc.) recebem encomendas em nome dos Correios, principalmente em áreas onde a entrega domiciliar é mais complicada.

Esse repositório é um monorepo com as duas partes do projeto:

- [`backend/`](backend/README.md) — Django + DRF + PostgreSQL
- [`frontend/`](frontend/) — React + TypeScript

Pra rodar o backend (Postgres + API), na raiz do repositório:

```
docker compose up
```

Detalhes de cada parte (estrutura, usuários de teste, como rodar sem Docker etc.) estão no README de cada pasta.
