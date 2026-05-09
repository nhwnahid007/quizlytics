import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { serverEnv } from "@/config/env";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: serverEnv.AUTH_SECRET });
  const pathname = req.nextUrl.pathname;
  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url));
}


export const config = {
  matcher: [
    "/quickExam",
    "/Dashboard/:path*",
    "/customQuiz",
    "/quizByLink",
    "/blogs/:path*",
    "/profile",
  ],
};
