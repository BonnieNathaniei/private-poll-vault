// FHEVM Types
export interface FhevmDecryptionSignature {
  contractAddress: string;
  userAddress: string;
  signature: string;
}

export interface FhevmDecryptionRequest {
  handle: string;
  contractAddress: string;
}

export interface FhevmStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<Map<string, string>>;
  remove(key: string): Promise<boolean>;
}

export interface DecryptResult {
  [handle: string]: bigint;
}















