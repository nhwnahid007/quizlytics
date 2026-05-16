import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import test from "node:test";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";

Object.assign(process.env, {
  NODE_ENV: "test",
  PORT: "1",
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/quizlytics_test",
  AUTH_SECRET:
    process.env.AUTH_SECRET ?? "test-auth-secret-with-at-least-32-chars",
  AI_API_KEY: process.env.AI_API_KEY ?? "test-ai-key",
  AI_MODEL: process.env.AI_MODEL ?? "test-ai-model",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "sk_test_123",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? "http://localhost:3000",
});

const startServer = async () => {
  const { app } = await import("../app.js");
  const server = app.listen(0);
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${address.port}/api/v1`,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close(error => (error ? reject(error) : resolve()));
      });
    },
  };
};

const userToken = async (email: string, role = "user") =>
  encode({
    token: {
      id: "11111111-1111-4111-8111-111111111111",
      email,
      role,
    },
    secret:
      process.env.AUTH_SECRET ?? "test-auth-secret-with-at-least-32-chars",
    maxAge: 60,
  });

test("unauthenticated access to user history fails", async () => {
  const server = await startServer();
  try {
    const response = await fetch(
      `${server.baseUrl}/userHistory?email=a@example.com`
    );

    assert.equal(response.status, 401);
  } finally {
    await server.close();
  }
});

test("user cannot access another user's email-scoped data", async () => {
  const server = await startServer();
  try {
    const token = await userToken("a@example.com");
    const response = await fetch(
      `${server.baseUrl}/userHistory?email=b@example.com`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    assert.equal(response.status, 403);
  } finally {
    await server.close();
  }
});

test("client cannot self-upgrade to Pro with extra payment fields", async () => {
  const server = await startServer();
  try {
    const token = await userToken("buyer@example.com");
    const response = await fetch(`${server.baseUrl}/paymentHistory`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId: "pi_test_123",
        userStatus: "Pro",
      }),
    });

    assert.equal(response.status, 400);
  } finally {
    await server.close();
  }
});

test("strict validators reject extra request fields", async () => {
  const { registerUserBodySchema } =
    await import("../validators/auth.validator.js");
  const { saveQuizHistoryBodySchema } =
    await import("../validators/quiz.validator.js");

  assert.equal(
    registerUserBodySchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password",
      role: "admin",
    }).success,
    false
  );

  assert.equal(
    saveQuizHistoryBodySchema.safeParse({
      quizTitle: "Secure quiz",
      userEmail: "test@example.com",
      unexpected: true,
    }).success,
    false
  );
});

test("plaintext password fallback does not work", async () => {
  const { verifyPassword } = await import("../services/auth.service.js");
  const hash = await bcrypt.hash("correct-password", 4);

  assert.equal(await verifyPassword("correct-password", hash), true);
  assert.equal(
    await verifyPassword("correct-password", "correct-password"),
    false
  );
});
