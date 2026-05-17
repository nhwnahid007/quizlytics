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

test("quiz generation count query is coerced and bounded", async () => {
  const { generateQuizQuerySchema } =
    await import("../validators/quiz.validator.js");

  const defaultCount = generateQuizQuerySchema.safeParse({
    category: "JavaScript",
    skill: "beginner",
  });
  assert.equal(defaultCount.success, true);
  if (defaultCount.success) {
    assert.equal(defaultCount.data.count, 10);
    assert.equal(defaultCount.data.includeExplanations, false);
  }

  const customCount = generateQuizQuerySchema.safeParse({
    category: "JavaScript",
    skill: "beginner",
    count: "5",
    includeExplanations: "true",
  });
  assert.equal(customCount.success, true);
  if (customCount.success) {
    assert.equal(customCount.data.count, 5);
    assert.equal(customCount.data.includeExplanations, true);
  }

  assert.equal(
    generateQuizQuerySchema.safeParse({
      category: "JavaScript",
      skill: "beginner",
      count: "21",
    }).success,
    false
  );
});

test("quiz cache key normalizes category and skill", async () => {
  const { normalizeQuizCacheKey } = await import("../services/quiz.service.js");

  assert.equal(
    normalizeQuizCacheKey(" JavaScript ", " Beginner ", 5),
    normalizeQuizCacheKey("javascript", "beginner", 5)
  );
});

test("generated quiz defaults add ids and optional fallback explanations", async () => {
  const { addGeneratedQuizDefaults } =
    await import("../services/quiz.service.js");

  const quizWithoutExplanation = addGeneratedQuizDefaults([
    {
      question: "Which option is true?",
      options: ["A", "B", "C", "D"],
      correct_answer: "2",
    },
  ]);

  assert.equal(quizWithoutExplanation[0]?.id, "1");
  assert.equal(quizWithoutExplanation[0]?.correct_answer, "2");
  assert.equal(quizWithoutExplanation[0]?.explain, undefined);

  const quiz = addGeneratedQuizDefaults(
    [
      {
        question: "Which option is true?",
        options: ["A", "B", "C", "D"],
        correct_answer: "2",
      },
    ],
    true
  );

  assert.equal(quiz[0]?.id, "1");
  assert.equal(quiz[0]?.correct_answer, "2");
  assert.equal(quiz[0]?.explain, "Correct answer is option 3: C.");
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
