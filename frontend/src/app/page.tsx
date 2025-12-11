"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { StatusBar } from "@/components/StatusBar";
import { HomePage } from "@/components/HomePage";
import { GamePage } from "@/components/GamePage";
import { useGameStore } from "@/store/useGameStore";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { isConnected } = useAccount();
  const { phase, reset } = useGameStore();

  // Reset game state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      reset();
    }
  }, [isConnected, reset]);

  const showGame = isConnected && phase !== "home";

  return (
    <main className="min-h-screen relative">
      <StatusBar />
      
      {showGame ? <GamePage /> : <HomePage />}
      
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(236, 72, 153, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#1a1a2e",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1a1a2e",
            },
          },
        }}
      />
    </main>
  );
}

