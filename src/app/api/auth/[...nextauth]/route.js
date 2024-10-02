import { connectDB } from "@/lib/connectDB";
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt';
import { signIn } from "next-auth/react";

export const authOption = {
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    session: {
        stategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },

    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const { email, password } = credentials;
                if (!email || !password) {
                    return null;
                }
                const db = await connectDB();
                const currentUser = await db.collection("registered_users").findOne({ email });
                if (!currentUser) {
                    return null;
                }
                const passwordMatched = bcrypt.compareSync(password, currentUser.password);
                if (!passwordMatched) {
                    return null;
                }
                return currentUser;
            }
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
        }),
        GithubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
        })
    ],

    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.profile = user.profile
            }
            return token;
        },
        async session({ session, token }) {
            session.user.profile = token.profile
            return session
        }
    },
    page: {
        signIn: '/login'
    },
}
const handler = NextAuth(authOption);

export { handler as GET, handler as POST };

