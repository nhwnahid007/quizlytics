import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      profile?: string | null;
      role?: string | null;
      userStatus?: string | null;
    };
  }

  interface User {
    id?: string;
    profile?: string | null;
    role?: string | null;
    userStatus?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    profile?: string | null;
    role?: string | null;
    userStatus?: string | null;
  }
}
