"use client";

// Polyfill global for browser (required by some Node.js libraries)
if (typeof window !== "undefined") {
  (window as any).global = window;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, Locale } from "@rainbow-me/rainbowkit";
import { config } from "@/config/wagmi";
import { useState, useEffect } from "react";
import { useFheStore } from "@/store/useFheStore";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

function FhevmInitializer() {
  const { initFhevm, status } = useFheStore();

  useEffect(() => {
    if (status === "idle") {
      initFhevm();
    }
  }, [initFhevm, status]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={"en-US" as Locale}
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#ec4899",
            accentColorForeground: "white",
            borderRadius: "medium",
            overlayBlur: "small",
          })}
        >
          <FhevmInitializer />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

