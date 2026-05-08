"use client"
import "../globals.css";
import type { ReactNode } from "react";
// import Footer from "@/components/Shared/Footer";

import AuthProviders from "@/providers/AuthProviders";
import Sidebar from "@/components/Shared/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";


export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen">
      <AuthProviders>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {isLoading ? (
              <div className="flex justify-center items-center w-full h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="flex w-full">
                <Sidebar className="sticky top-0" style={{ position: 'sticky', top: 0, height: '100vh' }} />
                <div className="flex-grow overflow-y-auto" style={{ height: '100vh' }}>
                  <ErrorBoundary>{children}</ErrorBoundary>
                </div>
              </div>
            )}
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProviders>
    </div>
  );
}
