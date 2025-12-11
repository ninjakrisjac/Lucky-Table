"use client";

import { motion } from "framer-motion";
import { ResultTier } from "@/store/useGameStore";

interface ResultDisplayProps {
  result: ResultTier;
  onPlayAgain: () => void;
}

const tierConfig = {
  0: {
    title: "NO PRIZE",
    symbol: "×",
    color: "text-metal-dim",
    border: "border-metal-dim/50",
    bg: "bg-ash/50",
    message: "TRY_AGAIN",
  },
  1: {
    title: "COMMON",
    symbol: "◆",
    color: "text-white",
    border: "border-white",
    bg: "bg-white/5",
    message: "PRIZE_CLAIMED",
  },
  2: {
    title: "RARE",
    symbol: "◈",
    color: "text-cyan-400",
    border: "border-cyan-400",
    bg: "bg-cyan-400/10",
    message: "EXCEPTIONAL_FIND",
  },
  3: {
    title: "LEGENDARY",
    symbol: "★",
    color: "text-neon-acid",
    border: "border-neon-acid",
    bg: "bg-neon-acid/10",
    message: "JACKPOT",
    glow: true,
  },
};

export function ResultDisplay({ result, onPlayAgain }: ResultDisplayProps) {
  const config = tierConfig[result];
  const isWin = result > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-xl"
    >
      <div className="w-full max-w-lg p-8 relative">
        {/* Brutalist Frame */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className={`absolute top-0 left-0 w-full h-1 ${config.bg.replace('/10', '')}`}
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
          className={`absolute top-0 right-0 w-1 h-full ${config.bg.replace('/10', '')}`}
        />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Result Icon */}
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.4 }}
            className={`
              w-36 h-36 mb-8 border-2 ${config.border} flex items-center justify-center
              ${config.bg} backdrop-blur-md relative
              ${isWin ? 'shadow-[0_0_60px_rgba(255,255,255,0.1)]' : ''}
            `}
          >
            <span className={`text-7xl ${config.color} ${isWin ? 'animate-pulse' : ''}`}>
              {config.symbol}
            </span>
            {isWin && (
              <div className={`absolute inset-0 border ${config.border} animate-ping opacity-30`} />
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`font-sans text-4xl md:text-5xl font-bold mb-3 tracking-tight ${config.color}`}
          >
            {config.title}
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`font-mono text-xs tracking-[0.3em] mb-12 ${isWin ? config.color : 'text-metal-dim'}`}
          >
            [{config.message}]
          </motion.p>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={onPlayAgain}
            className="w-full py-4 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider text-sm"
          >
            RETRY
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}
