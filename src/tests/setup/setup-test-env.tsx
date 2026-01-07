import { randomUUID } from "node:crypto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundaryProvider } from "@/providers/error-boundary-provider";
import "@testing-library/jest-dom";
import { type RenderOptions, render } from "@testing-library/react";

// Polyfill crypto.randomUUID for jsdom environment
if (typeof globalThis.crypto?.randomUUID !== "function") {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: randomUUID,
    writable: true,
    configurable: true,
  });
}

// Mock scrollIntoView for jsdom environment
Element.prototype.scrollIntoView = () => {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundaryProvider>
  );
};

const customRender = (
  // biome-ignore lint/suspicious/noExplicitAny: <>
  ui: React.ReactElement<any>,
  options: RenderOptions = {},
) =>
  render(ui, {
    wrapper: AppProviders,
    ...options,
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export { customRender as render };
