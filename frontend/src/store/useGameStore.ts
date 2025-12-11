import { create } from "zustand";

export type GamePhase =
  | "home"
  | "selecting"
  | "encrypting"
  | "submitting"
  | "waiting"
  | "decrypting"
  | "result";

export type ResultTier = 0 | 1 | 2 | 3; // 0 = no win, 1 = common, 2 = rare, 3 = legendary

interface GameState {
  phase: GamePhase;
  selectedBox: number | null;
  result: ResultTier | null;
  txHash: string | null;
  error: string | null;

  setPhase: (phase: GamePhase) => void;
  setSelectedBox: (box: number | null) => void;
  setResult: (result: ResultTier | null) => void;
  setTxHash: (hash: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: "home",
  selectedBox: null,
  result: null,
  txHash: null,
  error: null,

  setPhase: (phase) => set({ phase }),
  setSelectedBox: (box) => set({ selectedBox: box }),
  setResult: (result) => set({ result }),
  setTxHash: (hash) => set({ txHash: hash }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      phase: "home",
      selectedBox: null,
      result: null,
      txHash: null,
      error: null,
    }),
}));

