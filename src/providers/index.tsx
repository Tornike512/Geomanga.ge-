"use client";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { NextAuthProvider } from "./session-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthProvider>
      <ErrorBoundaryProvider>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </ErrorBoundaryProvider>
    </NextAuthProvider>
  );
};
