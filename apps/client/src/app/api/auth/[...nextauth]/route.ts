import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { AuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { db } from "@quizlytics/db";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@quizlytics/db/schema";

const authOption: AuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }) as Adapter,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;
        if (!email || !password) {
          return null;
        }
        const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const currentUser = result[0];
        if (!currentUser) {
          return null;
        }
        const storedPassword = currentUser.password;
        const isBcryptHash =
          typeof storedPassword === "string" &&
          /^\$2[aby]\$\d{2}\$/.test(storedPassword);
        const passwordMatched = isBcryptHash
          ? await bcrypt.compare(password, storedPassword)
          : storedPassword === password;

        if (!passwordMatched) {
          return null;
        }
        return {
          id: currentUser.id,
          name: currentUser.name ?? undefined,
          email: currentUser.email ?? undefined,
          image: currentUser.image ?? currentUser.profile ?? undefined,
          profile: currentUser.profile,
          role: currentUser.role,
          userStatus: currentUser.userStatus,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profile = user.profile;
        token.role = user.role;
        token.userStatus = user.userStatus;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.profile = token.profile;
      session.user.role = token.role;
      session.user.userStatus = token.userStatus;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
