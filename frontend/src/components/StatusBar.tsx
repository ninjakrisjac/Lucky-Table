"use client";

import { useFheStore } from "@/store/useFheStore";
import { useAccount, useDisconnect } from "wagmi";
import { CONTRACT_ADDRESS } from "@/config/wagmi";
import { useState } from "react";
import { motion } from "framer-motion";

export function StatusBar() {
  const { status: fheStatus } = useFheStore();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-void/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
        {/* Left: System Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 ${
                fheStatus === "ready"
                  ? "bg-neon-acid shadow-[0_0_10px_#ccff00]"
                  : "bg-neon-plasma shadow-[0_0_10px_#ff003c]"
              }`}
            />
            <span className={fheStatus === "ready" ? "text-neon-acid" : "text-neon-plasma"}>
              SYSTEM_{fheStatus === "ready" ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          
          <div className={`hidden md:flex items-center gap-2 ${address ? "text-neon-acid" : "text-metal-dim"}`}>
            <span className={`w-1.5 h-1.5 ${address ? "bg-neon-acid shadow-[0_0_8px_#ccff00]" : "bg-metal-dim/50"}`} />
            <span>SEPOLIA_NET</span>
          </div>
        </div>

        {/* Right: Address Info */}
        <div className="flex items-center gap-6">
          <a
            href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-metal-dim hover:text-neon-cyber transition-colors"
          >
            CONTRACT_{shortenAddress(CONTRACT_ADDRESS)}
          </a>

          {address && (
            <>
              <button
                onClick={copyAddress}
                className="text-metal hover:text-white transition-colors flex items-center gap-2"
              >
                <span>{copied ? "COPIED_TO_CLIPBOARD" : `USER_${shortenAddress(address)}`}</span>
                <div className="w-1.5 h-1.5 bg-metal" />
              </button>
              
              <button
                onClick={() => disconnect()}
                className="text-metal-dim hover:text-neon-plasma transition-colors border border-metal-dim/30 hover:border-neon-plasma/50 px-3 py-1"
              >
                DISCONNECT
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
