"use client"
import "../globals.css";
// import Footer from "@/components/Shared/Footer";

import AuthProviders from "@/providers/AuthProviders";
import Sidebar from "@/components/Shared/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { TooltipProvider } from "@/components/ui/tooltip";


export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust the delay as needed

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
              <>
                <Sidebar />
                <div className="flex-grow">
                  {children}
                </div>
              </>
            )}
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProviders>
    </div>
  );
}
