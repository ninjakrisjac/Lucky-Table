import { create } from "zustand";

type FhevmStatus = "idle" | "initializing" | "ready" | "error";

interface FheStore {
  status: FhevmStatus;
  error: string | null;

  setStatus: (status: FhevmStatus) => void;
  setError: (error: string | null) => void;

  initFhevm: () => Promise<void>;
}

export const useFheStore = create<FheStore>((set, get) => ({
  status: "idle",
  error: null,

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),

  initFhevm: async () => {
    if (get().status === "ready") return;
    if (get().status === "initializing") return;

    set({ status: "initializing", error: null });

    try {
      const { initFhevm } = await import("@/lib/fhe");
      await initFhevm();
      set({ status: "ready", error: null });
    } catch (error: any) {
      set({
        status: "error",
        error: error.message || "FHEVM initialization failed",
      });
    }
  },
}));

