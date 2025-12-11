"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { useFheStore } from "@/store/useFheStore";

export function HomePage() {
  const { isConnected } = useAccount();
  const { setPhase } = useGameStore();
  const { status: fheStatus } = useFheStore();

  const handleStart = () => {
    setPhase("selecting");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-void">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glitch Title */}
        <div className="glitch-wrapper mb-2">
          <h1 
            className="glitch-text font-sans text-7xl md:text-9xl font-bold tracking-tighter text-white mix-blend-difference"
            data-text="LUCKY TABLE"
          >
            LUCKY TABLE
          </h1>
        </div>

        {/* Subtitle / Tech Specs */}
        <div className="flex items-center gap-4 mb-16 font-mono text-sm md:text-base text-metal-dim uppercase tracking-widest">
          <span>[ FHE_ENABLED ]</span>
          <span className="w-px h-4 bg-metal-dim/30" />
          <span>[ ZAMA_POWERED ]</span>
          <span className="w-px h-4 bg-metal-dim/30" />
          <span>[ PROBABILITY_ENGINE ]</span>
        </div>

        {/* Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="group relative px-8 py-4 bg-white text-black font-mono font-bold text-lg uppercase tracking-wider hover:bg-neon-acid transition-colors duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Connect
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  {/* Brutalist Shadow */}
                  <div className="absolute inset-0 bg-transparent border border-white translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
                </button>
              )}
            </ConnectButton.Custom>
          ) : (
            <button
              onClick={handleStart}
              disabled={fheStatus !== "ready"}
              className={`
                group relative px-12 py-5 font-mono font-bold text-xl uppercase tracking-wider transition-all duration-300
                ${fheStatus === "ready" 
                  ? "bg-neon-acid text-black hover:bg-white" 
                  : "bg-ash text-metal-dim cursor-not-allowed"}
              `}
            >
              <span className="relative z-10">
                {fheStatus === "ready" ? "ENTER" : "SYSTEM INITIALIZING..."}
              </span>
              {fheStatus === "ready" && (
                <div className="absolute inset-0 border border-neon-acid translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
              )}
            </button>
          )}
        </motion.div>
      </div>

      {/* Decorative Footer Elements */}
      <div className="absolute bottom-10 left-10">
        <a
          href="https://github.com/ninjakrisjac/Lucky-Table"
          target="_blank"
          rel="noopener noreferrer"
          className="text-metal-dim hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>

      <div className="absolute bottom-10 right-10">
        <div className="w-24 h-24 border border-metal-dim/20 rounded-full animate-spin-slow flex items-center justify-center">
          <div className="w-2 h-2 bg-neon-acid" />
        </div>
      </div>
    </div>
  );
}
