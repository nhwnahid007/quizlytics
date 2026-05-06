import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

type RemoteAuthUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  profile?: string | null;
  role?: string | null;
  userStatus?: string | null;
};

type RoleResponse = {
  id?: string;
  image?: string | null;
  profile?: string | null;
  role?: string | null;
  userStatus?: string | null;
} | null;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const authOption: AuthOptions = {
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

        try {
          const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            return null;
          }

          const currentUser = (await response.json()) as RemoteAuthUser;
          if (!currentUser.id || !currentUser.email) {
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
        } catch (error) {
          console.error("Credentials auth failed:", error);
          return null;
        }
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
    async signIn({ user, account }) {
      if (
        account?.provider &&
        ["google", "github"].includes(account.provider) &&
        user?.email
      ) {
        try {
          await fetch(`${apiBaseUrl}/authenticating_with_providers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              role: "user",
              provider: account.provider,
            }),
          });
        } catch (error) {
          console.error("Provider sync failed:", error);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profile = user.profile;
        token.role = user.role;
        token.userStatus = user.userStatus;
      }

      if (token.email) {
        try {
          const roleResponse = await fetch(
            `${apiBaseUrl}/user/role?email=${encodeURIComponent(token.email)}`,
            { cache: "no-store" },
          );

          if (roleResponse.ok) {
            const dbUser = (await roleResponse.json()) as RoleResponse;
            if (dbUser) {
              token.id = dbUser.id ?? token.id;
              token.profile = dbUser.profile ?? token.profile;
              token.role = dbUser.role ?? token.role;
              token.userStatus = dbUser.userStatus ?? token.userStatus;
              token.picture = dbUser.image ?? token.picture;
            }
          }
        } catch (error) {
          console.error("Token role sync failed:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.profile = token.profile;
      session.user.role = token.role;
      session.user.userStatus = token.userStatus;
      session.user.image = token.picture ?? session.user.image;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
