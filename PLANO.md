# Plano de MVP — Sistema de Gestão de PUDOs (Ponto2Go)
### Baseado no artigo "Implementação de um sistema web para gestão de pontos de retirada (PUDOs)"

---

## 1. Resumo do que o artigo já decide

O artigo (seção 3 — Materiais e Métodos) já trava as seguintes decisões técnicas:

| Camada | Tecnologia definida no artigo |
|---|---|
| Frontend | React.js + TypeScript, shadcn/ui, Radix UI, Material UI |
| Backend | Django (Python) |
| Banco de dados | PostgreSQL (decidido — ver seção 2) |
| Entidades citadas | usuário, parceiro, ponto de retirada, endereço, encomenda, status da encomenda, movimentação |
| Regras de negócio citadas | cadastrar pontos de retirada, associar encomendas a pontos, atualizar status, registrar movimentações, consultar acompanhamento |
| Telas citadas (3.3) | tela inicial, login, cadastro de parceiros, cadastro de pontos PUDOs, listagem de pontos, cadastro de encomendas, consulta de status, gerenciamento de movimentações |

Telas que vocês já bateram o martelo (frontend):
- Cadastro
- Login
- Mapa com os pontos
- Encomendas do Usuário
- Rastreio
- Cadastro de ponto (fluxo do parceiro)

---

## 2. Decisões técnicas que precisam ser fechadas AGORA

Essas decisões bloqueiam o começo do desenvolvimento — resolvam isso na primeira conversa de vocês dois.

### 2.1 Banco de dados — ✅ Decidido: PostgreSQL
Usar PostgreSQL para tudo (dev e demo). **Lembrem de ajustar o texto do artigo**, que ainda cita "MySQL" em dois trechos da seção 3 — precisa trocar por PostgreSQL pra ficar coerente com o que foi decidido e com o que o resumo já dizia.

### 2.2 Autenticação
O artigo não especifica. Como o frontend é uma SPA React separada consumindo API do Django, faz mais sentido:
- **Django REST Framework (DRF) + JWT** (`djangorestframework-simplejwt`) em vez de sessão tradicional do Django.

### 2.3 Mapa
Vocês vão precisar mostrar pontos no mapa. Duas opções:
- **Google Maps API** — mais bonito, mas exige chave/cobrança configurada.
- **Leaflet + OpenStreetMap** — gratuito, sem necessidade de chave de API, ótimo para TCC.

**Recomendação:** Leaflet + OSM. Para o MVP, nem precisa de geocodificação automática de endereço — pode cadastrar lat/lng manualmente ou usar coordenadas fixas de Bauru/SP para os pontos de demonstração.

### 2.4 Quem cria a encomenda no sistema?
Não dá pra integrar com a API real dos Correios num TCC. Então:
- O **parceiro** registra o recebimento de uma encomenda no ponto dele (ação simples: código de rastreio + destinatário + ponto), simulando o momento em que os Correios "direcionam" o objeto para aquele PUDO.
- Isso já cobre a regra de negócio "associar encomendas a pontos" do artigo, sem precisar de integração externa.

### 2.5 ~~Dashboard administrativo~~ — Removido do escopo
Decidido: fora do projeto (não entra nem como bônus). O sistema fica com as 6 telas que vocês já haviam decidido.

### 2.6 Áreas de Restrição (ARE) — como tratar sem virar projeto de GIS
Não existe uma base de dados pública e estruturada das ARE reais dos Correios (o estudo citado no artigo é sobre reclamações de clientes, não um dataset geográfico). Reconstruir isso de verdade exigiria polígonos geográficos reais e cálculo de "ponto dentro da área" — complexidade de GIS (PostGIS/GeoDjango) desnecessária pro prazo.

**Recomendação:** tratar "área de restrição" como um dado **ilustrativo/fictício**, definido por vocês mesmos:
- Criar um cadastro simples de `AreaRestricao` (nome, cidade, bairros atendidos, motivo) com dados de exemplo baseados na própria cidade de vocês (Bauru).
- Cada `PontoRetirada` opcionalmente indica qual área de restrição ele atende (escolha manual do parceiro no cadastro, não um cálculo automático).
- Deixar isso explícito no artigo: *"para fins de demonstração do protótipo, foram definidas áreas de restrição ilustrativas com base no cenário descrito no referencial teórico"* — isso é normal e aceito em TCC de protótipo.

Isso resolve "quais pontos vamos colocar": escolham bairros fictícios da cidade de vocês, marquem alguns como "área de restrição" pro exemplo, e cadastrem pontos parceiros (papelaria, farmácia, mercado — os mesmos tipos que os Correios já usam hoje) que atendem essas áreas.

**Bônus barato (sem precisar de GIS):** usar a fórmula de Haversine (matemática simples de latitude/longitude) pra ordenar os pontos do mapa por distância até o endereço do usuário — dá a sensação de "sugestão do ponto mais próximo" sem precisar de roteamento real ou API paga.

---

## 3. Modelo de dados proposto (models Django)

Baseado nas entidades que o próprio artigo já cita (seção 3.2):

```
Usuario (extends AbstractUser)
- nome
- email
- tipo: "destinatario" | "parceiro"  (choices)
- telefone
- cpf

Endereco
- rua, numero, bairro, cidade, uf, cep
- latitude, longitude (nullable)

AreaRestricao
- nome                (ex: "Zona Norte - Bauru")
- cidade
- bairros_atendidos   (texto simples, ex: "Vila Falcão, Jardim Bela Vista")
- motivo              (texto livre, ex: "baixa cobertura operacional")

PontoRetirada
- nome
- endereco (FK -> Endereco)
- responsavel (FK -> Usuario, tipo=parceiro)
- area_restricao (FK -> AreaRestricao, nullable)
- horario_funcionamento
- capacidade_total
- capacidade_ocupada
- ativo (bool)

Encomenda
- codigo_rastreio (unique)
- destinatario (FK -> Usuario)
- ponto (FK -> PontoRetirada, nullable até ser direcionada)
- status_atual: "em_transito" | "aguardando_retirada" | "retirada_confirmada" | "devolvido"
- data_criacao
- prazo_guarda

Movimentacao
- encomenda (FK -> Encomenda)
- data_hora
- tipo_evento (texto: "registrado no ponto", "retirado pelo destinatário", etc.)
- descricao
```

Isso cobre exatamente as entidades do artigo (usuário, parceiro, ponto de retirada, endereço, encomenda, status, movimentação) sem inventar nada fora do que já foi escrito — importante para a coerência entre o artigo e o sistema entregue. `AreaRestricao` é a única entidade "nova" em relação ao artigo, e serve só para dar contexto ilustrativo às ARE citadas no referencial teórico (ver seção 2.6) — não é um requisito que o artigo já cobrava, é uma decisão de vocês para fechar essa lacuna.

---

## 4. Definição do MVP

### ✅ Essencial (precisa estar pronto para novembro)

1. **Cadastro e Login** — dois tipos de usuário (destinatário / parceiro)
2. **Mapa + listagem de pontos** — visualizar pontos, ver detalhes (capacidade, endereço, horário)
3. **Cadastro de ponto** — fluxo do parceiro cadastrando o próprio PUDO, com opção de vincular a uma área de restrição (dado ilustrativo, ver seção 2.6)
4. **Minhas Encomendas** — lista das encomendas do destinatário logado, com status
5. **Rastreio** — detalhe de uma encomenda específica com histórico de movimentações
6. **Painel do parceiro** — registrar recebimento de uma encomenda no ponto + atualizar status (ex.: marcar como retirada)
7. **Dados de demonstração (seed)** — cenário pronto para a apresentação: usuário logando, vendo o mapa, acompanhando uma encomenda até a retirada

---

## 5. Backlog de tarefas (Epics + Issues para o GitHub Projects)

Nada de dividir por pessoa nem por camada — os dois trabalham em frontend e backend. As tarefas estão organizadas por **Epic** (funcionalidade fatiada de ponta a ponta: banco + API + tela junto), na ordem em que fazem sentido de serem feitas, por causa das dependências entre elas (não dá pra fazer o painel do parceiro antes de ter autenticação, por exemplo).

Cada item abaixo já está no formato "título + descrição + critérios de aceite", pronto pra virar uma Issue no board. Sugestão de uso no GitHub Projects: cada Epic vira uma **label**, cada linha abaixo vira uma **Issue**, e vocês vão puxando da coluna Backlog conforme a disponibilidade — sem "isso é seu, isso é meu" fixo.

---

### Epic 0 — Setup do projeto
`label: epic:setup`

- **Configurar repositório backend (Django + DRF + Postgres)**
  Criar o projeto Django, instalar Django REST Framework, configurar conexão com PostgreSQL local via variáveis de ambiente.
  - [ ] Projeto Django criado e rodando localmente
  - [ ] DRF instalado e configurado
  - [ ] Conexão com Postgres funcionando (`.env` com credenciais)

- **Configurar repositório frontend (Vite + React + TS + shadcn/ui)**
  Criar o projeto com Vite, TypeScript, Tailwind e shadcn/ui prontos para uso.
  - [ ] Projeto rodando localmente com `npm run dev`
  - [ ] shadcn/ui configurado com pelo menos um componente de teste renderizando

- **Definir e documentar o contrato de API**
  Listar todos os endpoints (rota, método, payload de entrada, formato de resposta) num arquivo `API.md` no repositório, antes de começar a codar as telas.
  - [ ] Arquivo `API.md` com todos os endpoints do MVP documentados

---

### Epic 1 — Autenticação
`label: epic:autenticacao`

- **Model `Usuario` (custom user com tipo destinatário/parceiro)**
  - [ ] Model criado com campos: nome, email, tipo, telefone, cpf
  - [ ] Migration aplicada sem erros

- **Endpoint de cadastro (`POST /auth/registro`)**
  - [ ] Cria usuário do tipo destinatário ou parceiro
  - [ ] Retorna erro claro em caso de e-mail duplicado

- **Endpoint de login (`POST /auth/login`) com JWT**
  - [ ] Retorna access token + refresh token válidos
  - [ ] Endpoint de refresh funcionando

- **Tela de Cadastro (frontend)**
  - [ ] Formulário com seletor de tipo de conta (destinatário/parceiro)
  - [ ] Integrado ao endpoint de registro, com mensagens de erro exibidas

- **Tela de Login (frontend)**
  - [ ] Formulário integrado ao endpoint de login
  - [ ] Token salvo e usado nas próximas requisições

- **Proteção de rotas no frontend**
  - [ ] Usuário não autenticado é redirecionado para o login ao tentar acessar telas internas

---

### Epic 2 — Pontos de retirada
`label: epic:pontos`

- **Models `Endereco`, `PontoRetirada` e `AreaRestricao`**
  - [ ] Models criados conforme seção 3 deste documento
  - [ ] Migrations aplicadas sem erros

- **Seed de `AreaRestricao` com dados ilustrativos**
  - [ ] Pelo menos 2-3 áreas fictícias cadastradas (bairros de Bauru), usadas na demonstração

- **Endpoint de listagem de pontos (`GET /pontos`)**
  - [ ] Retorna todos os pontos ativos com endereço, capacidade e área de restrição vinculada

- **Endpoint de cadastro de ponto (`POST /pontos`)**
  - [ ] Só o usuário tipo parceiro pode cadastrar
  - [ ] Aceita vínculo opcional com uma `AreaRestricao`

- **Endpoint de detalhes do ponto (`GET /pontos/:id`)**
  - [ ] Retorna todos os dados do ponto para exibir no mapa

- **Tela de Mapa + lista de pontos (Leaflet + OSM)**
  - [ ] Mapa mostra marcadores de todos os pontos ativos
  - [ ] Lista lateral com os mesmos pontos, clicável (seleciona no mapa)

- **Tela de Cadastro de Ponto (parceiro)**
  - [ ] Formulário integrado ao endpoint de cadastro de ponto
  - [ ] Campo opcional de área de restrição

- **Badge indicando área de restrição no card do ponto**
  - [ ] Card/detalhe do ponto mostra visualmente quando ele atende uma área de restrição

---

### Epic 3 — Encomendas & Rastreio
`label: epic:encomendas`

- **Models `Encomenda` e `Movimentacao`**
  - [ ] Models criados conforme seção 3 deste documento
  - [ ] Migrations aplicadas sem erros

- **Endpoint "minhas encomendas" (`GET /encomendas`)**
  - [ ] Retorna só as encomendas do usuário logado, com status atual

- **Endpoint de rastreio (`GET /encomendas/:codigo/rastreio`)**
  - [ ] Retorna a encomenda + histórico completo de movimentações, ordenado por data

- **Tela "Minhas Encomendas"**
  - [ ] Lista as encomendas do usuário logado com status e botão "rastrear"

- **Tela de Rastreio**
  - [ ] Mostra linha do tempo das movimentações de uma encomenda específica

---

### Epic 4 — Painel do parceiro
`label: epic:parceiro`

- **Endpoint de registrar recebimento (`POST /encomendas`)**
  - [ ] Só parceiro pode chamar, vinculado ao próprio ponto
  - [ ] Cria a encomenda + gera automaticamente a primeira `Movimentacao`

- **Endpoint de atualizar status (`PATCH /encomendas/:id/status`)**
  - [ ] Atualiza `status_atual` e gera uma nova `Movimentacao` no histórico

- **Tela do painel do parceiro**
  - [ ] Lista as encomendas do ponto do parceiro logado
  - [ ] Ação de "registrar recebimento" e "marcar como retirada"

---

### Epic 5 — Dados de demonstração & Deploy
`label: epic:deploy`

- **Seed completo de dados de demonstração**
  - [ ] Usuários, pontos e encomendas de exemplo cobrindo o fluxo completo (cadastro → ponto → encomenda → retirada)

- **Deploy do backend**
  - [ ] Backend acessível via URL pública (Railway/Render), com Postgres em nuvem

- **Deploy do frontend**
  - [ ] Frontend acessível via URL pública (Vercel/Netlify), apontando para a API em produção

- **Configuração de CORS entre frontend e backend**
  - [ ] Frontend em produção consegue chamar a API sem erro de CORS

---

## 6. Observação sobre o artigo

Independente do backlog técnico, não esqueçam de corrigir a contradição PostgreSQL/MySQL no texto do artigo (seção 3), e de escrever "Resultados e Discussão" e "Considerações Finais" com base no que for realmente implementado.