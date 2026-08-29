# Ponto2Go

Backend do TCC do curso de Tecnologia em Banco de Dados da Fatec Bauru. A ideia do sistema é simular uma rede de pontos de retirada (PUDOs) onde parceiros locais (papelaria, mercado, farmácia etc.) recebem encomendas em nome dos Correios, principalmente em áreas onde a entrega domiciliar é mais complicada.

## Rodando o projeto

Precisa ter Docker instalado. Na raiz do repositório (onde fica o `docker-compose.yml`, um nível acima desta pasta):

```
docker compose up
```

Isso sobe o Postgres e o backend juntos. Toda vez que sobe, o container do backend roda sozinho as migrations e um seed com dados de demonstração, então já dá pra testar sem precisar cadastrar nada na mão.

A API fica em `http://localhost:8000`.

Se preferir rodar sem Docker, direto na máquina, dentro dessa pasta (`backend/`): sobe um Postgres, cria um virtualenv, `pip install -r requirements.txt`, ajusta o `DATABASE_URL` no `.env` e roda `python manage.py migrate` + `python manage.py runserver`.

## Estrutura

Django + Django REST Framework, banco PostgreSQL. Cada app segue mais ou menos o mesmo padrão de pastas:

- `models.py` — os models
- `domain/apis.py` — as regras de negócio ficam aqui
- `serializers.py` — validação de entrada, chama o domain
- `views.py` — só os ViewSets, o mais enxuto possível
- `urls.py`

Os apps:

- `usuarios` — autenticação (JWT) e cadastro de usuário
- `pontos` — endereço, ponto de retirada e área de restrição
- `encomendas` — encomenda e o histórico de movimentação dela
- `common` — o que é compartilhado entre os apps (permissions, model base)

## Usuários de teste

O seed sempre cria dois usuários:

| username | senha | tipo |
|---|---|---|
| `parceiro_demo` | `senha12345` | parceiro |
| `cliente_demo` | `senha12345` | destinatário |

O `parceiro_demo` já entra com dois pontos de retirada cadastrados (um deles vinculado a uma área de restrição, pra mostrar esse campo funcionando), e o `cliente_demo` já tem duas encomendas de exemplo: uma ainda aguardando retirada, outra já com status de retirada confirmada — essa segunda já dá pra ver o histórico com duas movimentações geradas pela trigger.

## Testando a API

Tem uma collection do Postman em `postman/Ponto2Go.postman_collection.json`. Importa no Postman e roda as pastas na ordem: Auth, Pontos, Encomendas. Os tokens e os IDs necessários (usuário, ponto, encomenda) são salvos automaticamente conforme as requisições vão rodando.
