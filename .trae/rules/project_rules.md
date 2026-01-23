## OláGuia Loctor — Regras do Projeto (Client + Server)

### Regras Gerais
- Respeite o padrão existente do código; copie o estilo do arquivo que estiver editando.
- Use TypeScript estrito (não introduza `any`/casts desnecessários).
- Não logue segredos: nunca registre senha, token JWT, refresh token, cookies ou conteúdo de headers de autenticação.
- Prefira reutilizar utilitários e padrões existentes em vez de criar novas abstrações.
- Use os aliases de importação configurados:
  - Client: `@/*` aponta para `/client/*`.
  - Server: `@/*` aponta para `/server/src/*`.

### Estrutura e Stack
- Client: Next.js 15 (App Router), React 19, TailwindCSS, shadcn/ui (Radix), React Hook Form + Zod, Axios.
- Server: Fastify 5, Prisma, Zod, JWT via `@fastify/jwt`, cookies via `@fastify/cookie`, multipart e arquivos estáticos.

### Client (`/client`)
- Rotas: `app/` (App Router), incluindo área administrativa em `app/admin/*`.
- UI: componentes shadcn em `components/ui/*`; componentes de domínio em `components/*`.
- API: `lib/api.ts` (Axios) usa:
  - `NEXT_PUBLIC_API_URL` (fallback atual: `http://localhost:1003`).
  - `withCredentials: true` (cookies são enviados/recebidos).
  - `Authorization: Bearer <token>` vindo do `localStorage`.
  - refresh automático via `PATCH /token/refresh` quando receber 401.
- Auth: `hooks/use-auth.tsx` gerencia token no `localStorage` e carrega usuário via `GET /me`.

#### Comandos (Client)
- Dev: `npm run dev` (porta 3000).
- Build: `npm run build`.
- Start: `npm run start` (porta 3005).

### Server (`/server`)
- Entrada: `src/server.ts` chama `app.listen` na `env.PORT` (default 3333).
- App Fastify: `src/app.ts` registra:
  - CORS com `credentials: true`
  - JWT com cookie `refreshToken`
  - Rotas: `usersRoutes`, `blogRoutes`, `uploadRoutes`, `siteSettingsRoutes`, `professionalsRoutes`
  - Static: serve `public/` em `prefix: "/"`.
- Env: `src/env/index.ts` valida `NODE_ENV`, `PORT`, `JWT_SECRET`, `FRONT_END_CALLBACK_URL`.
- Arquitetura: `http/controller/*` (camada HTTP) chama `use-cases/*` e `repositories/*` (Prisma e in-memory).

#### Comandos (Server)
- Dev: `npm run start:dev`
- Build: `npm run build`
- Testes (unit/use-cases): `npm test`
- Testes e2e (http): `npm run test:e2e`
- Seed: `npm run seed`

#### Regras de Qualidade (Server)
- Antes de entregar mudanças no server, rode:
  - `npm test` (quando afetar `src/use-cases/*`)
  - `npm run test:e2e` (quando afetar `src/http/*`/rotas/middlewares)
  - `npx tsc -p tsconfig.json --noEmit` (typecheck)

### Contratos Client ↔ Server (Não Quebrar)
- Autenticação:
  - Client usa `Authorization: Bearer` e também envia cookies (`withCredentials`).
  - Server deve continuar aceitando JWT via header e manter refresh por cookie (`PATCH /token/refresh`).
- CORS:
  - Se criar/alterar endpoints com novos métodos (ex.: `PATCH`), garanta que a config de CORS em `src/app.ts` inclua o método.
- Portas/URLs:
  - Garanta consistência entre `NEXT_PUBLIC_API_URL` (client) e `env.PORT`/host (server).
  - Em ambiente local, ajuste `NEXT_PUBLIC_API_URL` para apontar para a porta real do server.

