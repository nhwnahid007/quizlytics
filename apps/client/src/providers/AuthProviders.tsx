"use client"
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

const AuthProviders = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
};

export default AuthProviders;
