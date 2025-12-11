"use client";

import { motion } from "framer-motion";

interface MysteryBoxProps {
  boxNumber: 1 | 2 | 3;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function MysteryBox({
  boxNumber,
  isSelected,
  isDisabled,
  onClick,
}: MysteryBoxProps) {

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`
        relative w-full aspect-[3/4] max-w-[280px]
        flex flex-col
        transition-all duration-500
        ${isDisabled && !isSelected ? "opacity-20 grayscale" : ""}
      `}
    >
      {/* Main Container */}
      <div 
        className={`
          flex-1 border border-white/10 relative overflow-hidden
          ${isSelected ? "bg-white/5" : "bg-ash/50 hover:bg-ash"}
          transition-colors duration-300
        `}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <motion.div 
            layoutId="selection"
            className="absolute inset-0 border-2 border-neon-acid z-20"
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {/* Number Display */}
          <div className="font-sans text-8xl font-bold text-white/5 absolute top-0 right-0 leading-none">
            0{boxNumber}
          </div>

          {/* Central Graphic */}
          <div className={`
            w-24 h-24 border border-white/20 rounded-full flex items-center justify-center
            ${isSelected ? "border-neon-acid" : ""}
          `}>
            <div className={`
              w-2 h-2 bg-white
              ${isSelected ? "bg-neon-acid animate-pulse" : ""}
            `} />
          </div>

          {/* Label */}
          <div className="mt-8 font-mono text-xs tracking-[0.2em] text-metal-dim">
            BOX_0{boxNumber}
          </div>
        </div>

        {/* Scanline Effect on Hover/Select */}
        {(isSelected || !isDisabled) && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] w-full animate-scan pointer-events-none" />
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className={`
        h-1 mt-2 w-full transition-colors duration-300
        ${isSelected ? "bg-neon-acid" : "bg-white/10"}
      `} />
      
      {isSelected && (
        <div className="absolute -bottom-6 left-0 font-mono text-[10px] text-neon-acid tracking-widest animate-pulse">
          SELECTED_
        </div>
      )}
    </motion.button>
  );
}
