import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().default(""),
  NEXT_PUBLIC_IMG_HOSTING_KEY: z.string().default(""),
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().default(""),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string().default(""),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().default(""),
});

const serverEnvSchema = z.object({
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string().default(""),
});

const parseEnv = <T>(schema: z.ZodType<T>, value: unknown, name: string): T => {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid ${name} environment: ${message}`);
  }

  return parsed.data;
};

export const clientEnv = parseEnv(
  publicEnvSchema,
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_IMG_HOSTING_KEY: process.env.NEXT_PUBLIC_IMG_HOSTING_KEY,
    NEXT_PUBLIC_EMAILJS_SERVICE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  },
  "client public",
);

export const serverEnv =
  typeof window === "undefined"
    ? parseEnv(
        serverEnvSchema,
        {
          AUTH_SECRET: process.env.AUTH_SECRET,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
          GITHUB_ID: process.env.GITHUB_ID,
          GITHUB_SECRET: process.env.GITHUB_SECRET,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
        "server",
      )
    : ({} as z.infer<typeof serverEnvSchema>);

export const apiBaseUrl = `${clientEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/v1`;
