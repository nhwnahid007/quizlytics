import type { NextFunction, Request, Response } from "express";
import { decode, type JWT } from "next-auth/jwt";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const sessionCookieNames = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "__Host-next-auth.csrf-token",
];

export type AuthUser = {
  id?: string;
  email?: string | null;
  role?: string | null;
};

export type AuthenticatedUser = AuthUser & { email: string };

const parseCookies = (
  cookieHeader: string | undefined
): Map<string, string> => {
  const cookies = new Map<string, string>();
  if (!cookieHeader) {
    return cookies;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    if (!rawName || rawValue.length === 0) {
      continue;
    }
    cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
  }

  return cookies;
};

const getSessionToken = (req: Request): string | null => {
  const authHeader = req.header("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  const cookies = parseCookies(req.header("cookie"));
  for (const name of sessionCookieNames) {
    const token = cookies.get(name);
    if (token) {
      return token;
    }
  }

  return null;
};

const tokenToAuthUser = (token: JWT): AuthUser => ({
  id: typeof token.id === "string" ? token.id : undefined,
  email: typeof token.email === "string" ? token.email : null,
  role: typeof token.role === "string" ? token.role : null,
});

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    res.status(401).json({ success: false, message: "Unauthenticated" });
    return;
  }

  const token = await decode({ token: sessionToken, secret: env.AUTH_SECRET });
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthenticated" });
    return;
  }

  const authUser = tokenToAuthUser(token);
  if (!authUser.email) {
    res.status(401).json({ success: false, message: "Unauthenticated" });
    return;
  }

  res.locals.authUser = authUser;
  next();
};

export const getAuthUser = (res: Response): AuthenticatedUser => {
  const authUser = res.locals.authUser as AuthUser | undefined;
  if (!authUser?.email) {
    throw new AppError(401, "Unauthenticated");
  }
  return { ...authUser, email: authUser.email };
};

export const requireSelfOrAdmin =
  (getRequestedEmail: (req: Request, res: Response) => string | undefined) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authUser = res.locals.authUser as AuthUser | undefined;
    const requestedEmail = getRequestedEmail(req, res);

    if (!authUser?.email || !requestedEmail) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    if (authUser.role !== "admin" && authUser.email !== requestedEmail) {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }

    next();
  };

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await requireAuth(req, res, () => {
    const authUser = res.locals.authUser as AuthUser | undefined;
    if (authUser?.role !== "admin") {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  });
};

export const requireEducator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await requireAuth(req, res, () => {
    const authUser = res.locals.authUser as AuthUser | undefined;
    if (!["admin", "teacher", "examiner"].includes(authUser?.role ?? "")) {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  });
};
