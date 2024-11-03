// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_AUTH_SECRET });
  const pathname = req.nextUrl.pathname
  if (token) {
    return NextResponse.next(); 
  }

  
  return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url));
}


export const config = {
  matcher: [
    "/quickExam",
    "/Dashboard/:path*",
    '/customQuiz',
    '/quizByLink',
    '/blogs/:path*'
  ],
};
