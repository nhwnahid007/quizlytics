
import type { ReactNode } from "react";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQuery/ReactQueryClientProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata = {
  title: "Quizlytics",
  description:
    "A quiz-based analytics platform to test your knowledge and track your performance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryClientProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
