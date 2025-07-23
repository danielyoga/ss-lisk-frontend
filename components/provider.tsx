"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { darkTheme, XellarKitProvider } from "@xellar/kit";
import { WagmiProvider } from "wagmi";

import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme={darkTheme}>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
