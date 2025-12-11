"use client";

let instance: any = null;
let isInitialized = false;
let isInitializing = false;
let initError: string | null = null;

// Convert Uint8Array to hex string with 0x prefix
function toHex(arr: Uint8Array): `0x${string}` {
  return `0x${Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}

export async function initFhevm(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("FHEVM can only be initialized in browser");
  }

  if (instance && isInitialized) return instance;
  if (initError) throw new Error(initError);

  // Prevent concurrent initialization
  if (isInitializing) {
    return new Promise((resolve, reject) => {
      const check = setInterval(() => {
        if (isInitialized && instance) {
          clearInterval(check);
          resolve(instance);
        }
        if (initError) {
          clearInterval(check);
          reject(new Error(initError));
        }
      }, 100);
    });
  }

  isInitializing = true;

  try {
    // Use @zama-fhe/relayer-sdk with SepoliaConfig
    const { initSDK, createInstance, SepoliaConfig } = await import(
      "@zama-fhe/relayer-sdk/web"
    );
    
    // Initialize SDK (thread: 0 disables multi-threading to avoid COOP/COEP issues)
    await initSDK({ thread: 0 });
    
    // Create instance with built-in Sepolia config
    instance = await createInstance(SepoliaConfig);
    
    if (!instance) {
      throw new Error("FHEVM instance creation returned null");
    }

    isInitialized = true;
    initError = null;
    return instance;
  } catch (error: any) {
    initError = error.message || "Failed to initialize FHEVM";
    isInitialized = false;
    throw error;
  } finally {
    isInitializing = false;
  }
}

// Encrypt user choice (1, 2, or 3)
export async function encryptChoice(
  contractAddress: string,
  userAddress: string,
  choice: number
): Promise<{ handle: `0x${string}`; inputProof: `0x${string}` }> {
  if (choice < 1 || choice > 3) {
    throw new Error("Choice must be 1, 2, or 3");
  }

  const fhevm = await initFhevm();
  const input = fhevm.createEncryptedInput(contractAddress, userAddress);
  input.add8(choice);

  const encrypted = await input.encrypt();
  return {
    handle: toHex(encrypted.handles[0]),
    inputProof: toHex(encrypted.inputProof),
  };
}

// User private decryption - uses SDK's built-in userDecrypt method
export async function userDecrypt(
  handle: string,
  contractAddress: string,
  signer: any // viem WalletClient
): Promise<bigint> {
  const fhevm = await initFhevm();
  
  // Get user address
  const userAddress = typeof signer.getAddress === 'function' 
    ? await signer.getAddress()
    : signer.account?.address;
  
  if (!userAddress) {
    throw new Error("Cannot get user address from signer");
  }

  const { publicKey, privateKey } = fhevm.generateKeypair();
  const eip712 = fhevm.createEIP712(publicKey, [contractAddress]);

  // Get startTimestamp and durationDays from EIP712 message
  const startTimestamp = eip712.message.startTimestamp ?? Math.floor(Date.now() / 1000);
  const durationDays = eip712.message.durationDays ?? 1;

  // Prepare message with proper values
  const message = {
    ...eip712.message,
    startTimestamp: BigInt(startTimestamp),
    durationDays: BigInt(durationDays),
  };

  const signature = await signer.signTypedData({
    domain: eip712.domain,
    types: eip712.types,
    primaryType: eip712.primaryType,
    message: message,
  });

  const publicKeyStr = publicKey instanceof Uint8Array ? toHex(publicKey) : publicKey;
  const privateKeyStr = privateKey instanceof Uint8Array ? toHex(privateKey) : privateKey;

  const results = await fhevm.userDecrypt(
    [{ handle, contractAddress }],
    privateKeyStr,
    publicKeyStr,
    signature,
    [contractAddress],
    userAddress,
    String(startTimestamp),
    String(durationDays)
  );

  const decryptedValue = results[handle];
  if (decryptedValue === undefined) {
    throw new Error("No decrypted value found for handle");
  }
  
  return BigInt(decryptedValue);
}

export function isFhevmReady(): boolean {
  return isInitialized && instance !== null;
}

export function getFhevmError(): string | null {
  return initError;
}

export function getFhevmStatus(): "idle" | "initializing" | "ready" | "error" {
  if (initError) return "error";
  if (isInitialized && instance) return "ready";
  if (isInitializing) return "initializing";
  return "idle";
}
