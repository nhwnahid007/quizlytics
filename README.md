# Quizlytics

Quizlytics is a full-stack quiz platform with a Next.js client, Express API
server, shared TypeScript types, and a PostgreSQL database layer powered by
Drizzle ORM.

## Monorepo Structure

```text
quizlytics/
├── apps/
│   ├── client/              # Next.js frontend
│   └── server/              # Express API server
├── packages/
│   ├── db/                  # Drizzle schema, database client, migrations
│   ├── tsconfig/            # Shared TypeScript config
│   └── types/               # Shared app/API model types
├── .env.example
├── package.json
├── tsconfig.base.json
└── turbo.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL

## Setup

```bash
git clone <repo-url>
cd quizlytics
cp .env.example .env
```

Fill `.env` with your local secrets and service credentials.

```bash
npm install
cd packages/db
npm run generate
npm run migrate
cd ../..
turbo dev
```

If `turbo` is not installed globally, use:

```bash
npm run dev
```

## Build

```bash
turbo build
```

Equivalent npm script:

```bash
npm run build
```

## Workspace Commands

```bash
npm --workspace @quizlytics/client run dev
npm --workspace @quizlytics/client run build

npm --workspace @quizlytics/server run dev
npm --workspace @quizlytics/server run build

npm --workspace @quizlytics/db run build
npm --workspace @quizlytics/db run generate
npm --workspace @quizlytics/db run migrate

npm --workspace @quizlytics/types run build
```

## Database

Drizzle schema files live in `packages/db/src/schema`.

Generate migrations:

```bash
cd packages/db
npm run generate
```

Run migrations:

```bash
cd packages/db
npm run migrate
```

`DATABASE_URL` must point to a PostgreSQL database before running migrations.

## Environment Variables

| Variable                          | Description                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`                    | PostgreSQL connection string used by Drizzle.                    |
| `NEXT_PUBLIC_API_URL`             | Public base URL for the Express API consumed by client requests. |
| `PORT`                            | Express server port. Defaults to `4000`.                         |
| `ALLOWED_ORIGINS`                 | Comma-separated client origins allowed by server CORS.           |
| `AI_API_KEY`                      | Google Generative AI API key used by quiz generation endpoints.  |
| `AI_MODEL`                        | Google Generative AI model name. Defaults on the server.         |
| `AUTH_SECRET`                     | NextAuth JWT/session secret.                                     |
| `NEXTAUTH_URL`                    | Public URL for the Next.js app, used by NextAuth.                |
| `GOOGLE_CLIENT_ID`                | Google OAuth client ID (server-only).                            |
| `GOOGLE_CLIENT_SECRET`            | Google OAuth client secret (server-only).                        |
| `GITHUB_ID`                       | GitHub OAuth client ID (server-only).                            |
| `GITHUB_SECRET`                   | GitHub OAuth client secret (server-only).                        |
| `STRIPE_SECRET_KEY`               | Stripe secret key for payment intent API route.                  |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`   | Stripe publishable key for client payment pages.                 |
| `NEXT_PUBLIC_IMG_HOSTING_KEY`     | Image hosting API key used by upload flows.                      |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`  | EmailJS service ID for contact form.                             |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template ID for contact form.                            |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`  | EmailJS public key for contact form.                             |

## Notes

- Client code does not connect to the database directly.
- Server database access goes through `@quizlytics/db`.
- Shared data models are exported from `@quizlytics/types`.
- NextAuth uses the Drizzle adapter with the PostgreSQL Auth.js tables in
  `packages/db`.
- The Express API and NextAuth client must share the same `AUTH_SECRET`.
- Payment upgrades require server-side Stripe PaymentIntent verification before
  `userStatus` is set to `Pro`.

## Security Checks

```bash
npm --workspace @quizlytics/server run test:security
npm --workspace @quizlytics/server run lint
npm --workspace @quizlytics/client run lint
npm run build
```

Security-sensitive behavior covered by tests:

- unauthenticated user-scoped API access fails;
- User A cannot request User B's email-scoped data;
- client-submitted payment fields cannot self-upgrade a user to Pro;
- extra request fields are rejected by strict validators;
- plaintext password fallback is disabled.
