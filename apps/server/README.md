# Quizlytics Server

Express API for Quizlytics.

## Required Environment

```bash
PORT=4000
DATABASE_URL="postgres://postgres:postgres@localhost:5432/quizlytics"
AUTH_SECRET="generate-at-least-32-characters"
ALLOWED_ORIGINS="http://localhost:3000"
AI_API_KEY="google-ai-api-key"
AI_MODEL="gemini-2.5-flash"
STRIPE_SECRET_KEY="sk_live_or_test_key"
```

`AUTH_SECRET` must match the NextAuth `AUTH_SECRET` used by the client so the
API can verify session/JWT tokens.

## Secure Auth Flow

- User-scoped API routes require a NextAuth JWT/session cookie or
  `Authorization: Bearer <token>`.
- Email query/body fields are not trusted for authorization. Non-admin users can
  only request their own email-scoped data.
- Server-created users always default to `role: "user"` and
  `userStatus: "Free"`.
- Provider-auth requests may create the user record, but client-submitted
  `role`, `userStatus`, and `provider` fields are rejected.
- Legacy plaintext password fallback is disabled. Users with non-bcrypt password
  values must reset their password or be migrated by hashing a newly verified
  password.

## Secure Payment Flow

- The client creates a Stripe PaymentIntent through the authenticated Next.js
  route.
- The PaymentIntent metadata is populated from the authenticated session, not
  request body email fields.
- The Express `/paymentHistory` route accepts only `transactionId`.
- The API retrieves the PaymentIntent from Stripe and grants `userStatus: "Pro"`
  only when:
  - the PaymentIntent status is `succeeded`;
  - the PaymentIntent metadata email matches the authenticated API user.

## Security Tests

```bash
npm --workspace @quizlytics/server run test:security
```

The tests cover unauthenticated access, cross-user access, client-side Pro
escalation attempts, strict request fields, and disabled plaintext password
fallback.

## Checks

```bash
npm --workspace @quizlytics/server run lint
npm --workspace @quizlytics/server run test:security
```
