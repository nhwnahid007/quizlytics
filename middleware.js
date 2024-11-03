// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_AUTH_SECRET });

  // If the token exists, the user is authenticated
  if (token) {
    return NextResponse.next(); // Allow the request
  }

  // If no token is found, redirect the user to the login page
  return NextResponse.redirect(new URL('/login', req.url));
}

// Define the paths that require authentication
export const config = {
  matcher: [
    "/quickExam*",
    "/Dashboard/:path*",
    '/customQuiz',
    '/quizByLink'
  ],
};
