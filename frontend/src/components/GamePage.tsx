"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useWalletClient } from "wagmi";
import { MysteryBox } from "./MysteryBox";
import { ResultDisplay } from "./ResultDisplay";
import { useGameStore, ResultTier } from "@/store/useGameStore";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/wagmi";
import { encryptChoice, userDecrypt } from "@/lib/fhe";
import toast from "react-hot-toast";

const phaseMessages = {
  selecting: "SELECTION TABLE",
  encrypting: "ENCRYPTING_PAYLOAD...",
  submitting: "BROADCASTING_TX...",
  waiting: "AWAITING_CONSENSUS...",
  decrypting: "DECRYPTING_RESULT...",
  result: "",
};

export function GamePage() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const {
    phase,
    setPhase,
    selectedBox,
    setSelectedBox,
    result,
    setResult,
    setError,
    reset,
  } = useGameStore();

  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  // Use wagmi's built-in transaction receipt hook
  const { isSuccess: isConfirmed, isError: txFailed } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  // Read result handle from contract
  const { refetch: refetchResult } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getResultHandle",
    account: address,
    query: { enabled: false },
  });

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && phase === "waiting") {
      handleDecryption();
    }
    if (txFailed && phase === "waiting") {
      toast.dismiss("tx");
      toast.error("TX_FAILED", {
        style: { background: "#0A0A0B", color: "#FF003C", fontFamily: "monospace" }
      });
      reset();
    }
  }, [isConfirmed, txFailed]);

  const handleDecryption = async () => {
    if (!walletClient) {
      toast.error("WALLET_NOT_CONNECTED", {
        style: { background: "#0A0A0B", color: "#FF003C", fontFamily: "monospace" }
      });
      reset();
      return;
    }

    setPhase("decrypting");
    toast.dismiss("tx");
    
    toast.loading("FETCHING_ENCRYPTED_RESULT...", { 
      id: "decrypt",
      style: { background: "#0A0A0B", color: "#fff", fontFamily: "monospace" }
    });

    try {
      // Wait a moment for chain state to settle
      await new Promise((r) => setTimeout(r, 3000));
      
      const { data: handle } = await refetchResult();
      if (!handle || handle === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        throw new Error("No result handle found - transaction may have failed");
      }

      toast.dismiss("decrypt");
      toast.loading("SIGN_TO_DECRYPT (check wallet)...", { 
        id: "decrypt",
        style: { background: "#0A0A0B", color: "#FFAA00", fontFamily: "monospace" }
      });

      const decryptedValue = await userDecrypt(
        handle as string,
        CONTRACT_ADDRESS,
        walletClient
      );
      
      const decryptedResult = Number(decryptedValue) as ResultTier;
      
      toast.dismiss("decrypt");
      toast.success("DECRYPTION_COMPLETE", {
        style: { background: "#0A0A0B", color: "#00FF88", fontFamily: "monospace" }
      });
      
      setResult(decryptedResult);
      setPhase("result");
    } catch (error: any) {
      toast.dismiss("decrypt");
      
      // Check if user rejected signature
      if (error.message?.includes("User rejected") || error.message?.includes("rejected")) {
        toast.error("SIGNATURE_REJECTED", {
          style: { background: "#0A0A0B", color: "#FF003C", fontFamily: "monospace" },
          duration: 3000,
        });
      } else {
        toast.error(`DECRYPT_ERROR: ${error.message?.slice(0, 50)}`, {
          style: { background: "#0A0A0B", color: "#FF003C", fontFamily: "monospace" },
          duration: 5000,
        });
      }
      setError(error.message);
      reset();
    }
  };

  const handleBoxSelect = async (boxNumber: 1 | 2 | 3) => {
    if (phase !== "selecting" || !address) return;

    setSelectedBox(boxNumber);
    setPhase("encrypting");

    try {
      const encrypted = await encryptChoice(CONTRACT_ADDRESS, address, boxNumber);
      setPhase("submitting");

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "draw",
        args: [encrypted.handle, encrypted.inputProof],
        gas: 5000000n,
      });

      setTxHash(hash);
      setPhase("waiting");

      toast.loading("TX_PENDING", { 
        id: "tx",
        style: { background: "#0A0A0B", color: "#fff", fontFamily: "monospace" }
      });

    } catch (error: any) {
      setError(error.message);
      toast.error("EXECUTION_FAILED", {
        style: { background: "#0A0A0B", color: "#FF003C", fontFamily: "monospace" }
      });
      reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative px-4 pt-20 bg-void">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Progress Line */}
      <div className="fixed left-8 top-0 bottom-0 w-px bg-white/5 hidden md:block">
        <motion.div 
          className="w-full bg-neon-acid"
          initial={{ height: "0%" }}
          animate={{ height: phase === "result" ? "100%" : "30%" }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        {/* Status Text */}
        <AnimatePresence mode="wait">
          {phase !== "result" && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full mb-16 text-center"
            >
              <h2 className="font-mono text-sm md:text-base text-neon-acid tracking-[0.2em] mb-2">
                // STATUS
              </h2>
              <div className="font-sans text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">
                {phaseMessages[phase]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boxes */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12">
          {[1, 2, 3].map((num) => (
            <MysteryBox
              key={num}
              boxNumber={num as 1 | 2 | 3}
              isSelected={selectedBox === num}
              isDisabled={phase !== "selecting"}
              onClick={() => handleBoxSelect(num as 1 | 2 | 3)}
            />
          ))}
        </div>

        {/* Back Action */}
        {phase === "selecting" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={reset}
            className="mt-20 font-mono text-xs text-metal-dim hover:text-white transition-colors"
          >
            BACK
          </motion.button>
        )}
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {phase === "result" && result !== null && (
          <ResultDisplay result={result} onPlayAgain={reset} />
        )}
      </AnimatePresence>
    </div>
  );
}
