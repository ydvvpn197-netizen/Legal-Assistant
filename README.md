# Legal Assistant (India) Monorepo

Monorepo for AI Legal Assistant targeting the Indian audience.

## Structure

- apps/
  - web: Next.js app
  - api: Fastify API server
- packages/
  - db: Prisma client and schema

## Prerequisites

- Node.js >= 18.18 (recommend 20 LTS)
- pnpm (corepack enable)
- Docker (for PostgreSQL)

## Setup

1. Copy environment template and adjust if needed:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d postgres
```

3. Install dependencies:

```bash
pnpm install
```

4. Generate Prisma client and push initial schema:

```bash
pnpm db:generate
pnpm db:push
```

5. Run development servers:

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

Test health endpoints:

- Web rewrite to API: http://localhost:3000/api/healthz
- API direct: http://localhost:4000/healthz

## Disclaimer

This system provides general legal information and is not a substitute for legal advice. Consult a licensed advocate for specific matters.
# Legal-Assistant
Legal Assistant
