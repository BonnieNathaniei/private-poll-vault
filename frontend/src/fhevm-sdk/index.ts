// FHEVM SDK for private-pool-vault
// Simplified implementation based on Vote project

export * from "./types";
export * from "./encryption";
export * from "./decryption";

// Core types and functions
export interface FhevmInstance {
  createEncryptedInput(contractAddress: string, userAddress: string): RelayerEncryptedInput;
}

export interface RelayerEncryptedInput {
  add8(value: number): RelayerEncryptedInput;
  add32(value: number): RelayerEncryptedInput;
  encrypt(): Promise<EncryptResult>;
}

export interface EncryptResult {
  handles: string[];
  inputProof: string;
}


// Factory function to create FHEVM instance
export function createFhevmInstance(): FhevmInstance {
  // For now, return a mock implementation
  // In production, this would connect to the actual FHEVM relayer
  return new MockFhevmInstance();
}

// Mock implementation for development
class MockFhevmInstance implements FhevmInstance {
  createEncryptedInput(): RelayerEncryptedInput {
    return new MockRelayerEncryptedInput();
  }
}

class MockRelayerEncryptedInput implements RelayerEncryptedInput {
  private values: number[] = [];

  add8(value: number): RelayerEncryptedInput {
    this.values.push(value);
    return this;
  }

  add32(value: number): RelayerEncryptedInput {
    this.values.push(value);
    return this;
  }

  async encrypt(): Promise<EncryptResult> {
    // Generate mock encrypted data
    const handle = `0x${Math.random().toString(16).substring(2).padEnd(64, '0')}`;
    const inputProof = `0x${Math.random().toString(16).substring(2).repeat(32)}`;

    return {
      handles: [handle],
      inputProof,
    };
  }
}















