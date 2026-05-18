# StudyCheck — `aclr-studycheck`

Plataforma da comunidade **AceleraDev** que registra sessões de estudo
automaticamente a partir de canais de voz no Discord e devolve tempo de
foco, ofensiva (streak) e um ranking semanal — **sem o usuário clicar em
nada**.

> Entrou na call de estudo → o bot detecta → a sessão começa.
> Saiu da call → a sessão fecha → tempo, ofensiva e ranking atualizam.

Projeto não-oficial, mantido por [Luanderson-Dev](https://github.com/Luanderson-Dev).

---

## Sumário

- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Pré-requisitos](#pré-requisitos)
- [Configuração (`.env`)](#configuração-env)
- [Subir tudo com Docker](#subir-tudo-com-docker)
- [Desenvolvimento local](#desenvolvimento-local)
- [Fluxo de autenticação (Discord OAuth)](#fluxo-de-autenticação-discord-oauth)
- [API HTTP](#api-http)
- [Mensageria (Kafka)](#mensageria-kafka)
- [Escopo do MVP](#escopo-do-mvp)
- [Convenções](#convenções)
- [Licença](#licença)

---

## Arquitetura

Três aplicações independentes compartilhando um Postgres e um broker Kafka:

```
Discord (voz)
   │  evento entrar/sair de canal
   ▼
[ bot ]  ──publica evento──►  Kafka  ──consome──►  [ api ]
   │                                                  │
   │ logs no canal de texto                           │ abre/fecha sessão, calcula
   ▼                                                  ▼ streak e ranking, persiste
Discord (texto)                                     Postgres
                                                      ▲
                                                      │ REST + JWT
                                                  [ frontend ]  ◄── usuário (browser)
```

- O **bot** observa eventos de voz e publica no Kafka; também autentica
  na API com `BOT_API_KEY`.
- A **api** consome os eventos, abre/fecha sessões, calcula streak e
  ranking, e expõe REST autenticada por JWT.
- O **frontend** (Angular SSR) autentica via Discord OAuth e mostra
  painel pessoal + ranking.

## Stack

| App        | Tecnologia                                                            |
|------------|-----------------------------------------------------------------------|
| `api`      | Spring Boot 4.0.x · Java 25 · Spring Security (JWT) · JPA · Flyway · Kafka |
| `bot`      | TypeScript · discord.js 14 · discordx · tsyringe · kafkajs · ioredis   |
| `frontend` | Angular 21 (standalone, signals) · SSR (Express) · Tailwind 4 · Vitest |
| Infra      | PostgreSQL 16 · Apache Kafka 3.8 (KRaft, sem Zookeeper) · Redis 7      |

## Estrutura do monorepo

```
aclr-studycheck/
├── api/                 # Spring Boot — REST, JWT, Flyway, consumidor Kafka
├── bot/                 # Discord bot — eventos de voz → Kafka + logs
├── frontend/            # Angular 21 SSR — login, painel, ranking
├── docker-compose.yml   # db, redis, kafka, api, bot, frontend (+ kafka-ui)
├── .env.example         # modelo de variáveis de ambiente
└── README.md
```

## Pré-requisitos

- **Docker** + **Docker Compose** (caminho recomendado).
- Para desenvolvimento sem Docker: **JDK 25**, **Node.js 22+**, **Postgres 16**, **Kafka 3.8**.
- Uma **aplicação Discord** ([Developer Portal](https://discord.com/developers/applications))
  com OAuth2 e um **bot** com permissão de ler eventos de voz no servidor alvo.

## Configuração (`.env`)

Copie o modelo e preencha os segredos:

```bash
cp .env.example .env
```

Variáveis principais:

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | credenciais do Postgres |
| `JWT_SEGREDO` | chave HMAC-SHA256 do JWT (≥ 256 bits) |
| `BOT_API_KEY` | segredo compartilhado api ↔ bot |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | OAuth2 da aplicação Discord |
| `DISCORD_REDIRECT_URI` | `http://localhost:4200/auth/discord/callback` (dev) |
| `DISCORD_GUILD_ID` | servidor de estudo (restringe o login) |
| `DISCORD_BOT_TOKEN` | token do bot |
| `DISCORD_LOG_CHANNEL_ID` | canal de texto onde o bot posta os logs de voz |
| `DISCORD_ALLOWED_VOICE_CHANNEL_IDS` | canais de voz monitorados (vazio = todos) |
| `APP_SECURITY_COOKIE_SEGURO` | `true` em produção (cookie HTTPS) |
| `API_PORT` / `FRONTEND_PORT` | portas expostas no host |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` no host · `kafka:9094` no compose |

> `DISCORD_MOD_ROLE_ID` ainda existe no backend, mas o frontend do MVP
> **não expõe área de administração** — todos acessam como usuário.

## Subir tudo com Docker

```bash
docker compose up -d --build                     # api, bot, frontend, db, redis, kafka
docker compose --profile tools up -d kafka-ui    # UI do Kafka em :8090 (opcional)
docker compose ps                                # status
docker compose logs -f api                       # logs de um serviço
docker compose down                              # parar (mantém volumes)
```

Acessos padrão:

- Frontend: <http://localhost:4200>
- API: <http://localhost:8080>
- Kafka UI (perfil `tools`): <http://localhost:8090>

## Desenvolvimento local

Infra essencial primeiro:

```bash
docker compose up -d db kafka redis
```

**API** (`api/`):

```bash
./mvnw spring-boot:run        # sobe em :8080
./mvnw clean verify           # build + testes (precisa de db + kafka no ar)
```

**Bot** (`bot/`):

```bash
npm install
npm start                     # tsx src/main.ts
npm run build                 # tsc → build/
npm run start:prod            # node build/main.js
```

**Frontend** (`frontend/`):

```bash
npm install
npm start                     # ng serve → http://localhost:4200
npm run build                 # build de produção (SSR) → dist/frontend
npm test                      # Vitest
npm run serve:ssr:frontend    # roda o SSR já buildado
```

> Mantenha o dev server do frontend na **porta 4200** — o redirect do
> Discord OAuth está fixo em `http://localhost:4200/auth/discord/callback`.

## Fluxo de autenticação (Discord OAuth)

1. Usuário clica **Entrar com Discord** → frontend pede `/auth/discord/url`.
2. Redireciona ao Discord → consentimento → volta em
   `/auth/discord/callback?code=...`.
3. Frontend troca o `code` em `POST /auth/discord/token`.
4. API valida o membro no `DISCORD_GUILD_ID`, emite **access token JWT
   (TTL curto)** e seta um **refresh token** em cookie HttpOnly.
5. Interceptor anexa `Authorization: Bearer <token>`; em `401`, chama
   `/auth/refresh` (cookie automático) e repete a requisição.

## API HTTP

Base autenticada por JWT, exceto `/auth/**`, `/api/internal/**` e Swagger.

**Auth — `/auth`**

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/auth/discord/url` | URL de consentimento OAuth |
| `POST` | `/auth/discord/token` | troca `code` por sessão |
| `POST` | `/auth/refresh` | renova access token (cookie) |
| `POST` | `/auth/logout` | encerra a sessão |

**Sessões — `/api/sessions`**

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/api/sessions/minhas` | minhas sessões |
| `GET`  | `/api/sessions/aberta` | sessão em aberto |
| `GET`  | `/api/sessions/streak` | ofensiva (atual/recorde) |
| `GET`  | `/api/sessions/leaderboard` | ranking |
| `POST` | `/api/sessions/start` · `/stop` | abrir/fechar manualmente |
| `GET`  | `/api/sessions/admin` | consulta administrativa |

**Usuários — `/api/usuarios`** · perfil, avatar, sync.

**Internas — `/api/internal/**`** · usadas pelo bot (autenticadas por
`BOT_API_KEY`).

> Documentação interativa: `http://localhost:8080/swagger-ui/index.html`.

## Mensageria (Kafka)

- Broker Apache Kafka 3.8 em modo **KRaft** (sem Zookeeper).
- Host: `localhost:9092` · dentro da rede do compose: `kafka:9094`.
- O bot publica eventos de voz; a api consome no grupo
  `KAFKA_CONSUMER_GROUP` e materializa as sessões.
- UI opcional via `docker compose --profile tools up -d kafka-ui`.

## Escopo do MVP

Foco em **validar o produto** com o mínimo:

- ✅ Login via Discord (restrito ao servidor do AceleraDev).
- ✅ Sessão automática por presença em canal de voz.
- ✅ Painel pessoal: sessão ativa, foco, ofensiva, histórico.
- ✅ Ranking da comunidade.
- ✅ Tema claro/escuro.
- ⛔ **Sem** área de administração / gestão por cargo no frontend
  (todos acessam como usuário único).

## Convenções

- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:` …).
- Branch padrão **`main`**; trabalho em **`develop`**.
- Migrations Flyway são **append-only** — nunca editar `V__*.sql` aplicada.
- Contratos cross-app (`BOT_API_KEY`, IDs do Discord, redirect OAuth,
  tópicos Kafka) devem ficar **sincronizados entre as três apps**.

## Licença

[MIT](LICENSE) © Luanderson-Dev
