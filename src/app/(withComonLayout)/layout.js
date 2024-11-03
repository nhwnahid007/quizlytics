"use client";
import "../globals.css";
import { useState, useEffect } from "react";
import Footer from "@/components/Shared/Footer";
import AuthProviders from "@/providers/AuthProviders";
import Header from "@/components/Shared/Navbar/Header";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

export default function RootLayout({ children }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <AuthProviders>
                <Header />
                <div className="min-h-screen">
                    {children}
                </div>
                <Footer />
            </AuthProviders>
        </div>
    )
}