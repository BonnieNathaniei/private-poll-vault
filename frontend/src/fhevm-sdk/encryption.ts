"use client";

import { useCallback, useMemo } from "react";
import { FhevmInstance, RelayerEncryptedInput, EncryptResult } from "./index";

// Map external encrypted integer type to encryption method
export const getEncryptionMethod = (internalType: string): string => {
  switch (internalType) {
    case "externalEbool":
      return "addBool";
    case "externalEuint8":
      return "add8";
    case "externalEuint16":
      return "add16";
    case "externalEuint32":
      return "add32";
    case "externalEuint64":
      return "add64";
    case "externalEuint128":
      return "add128";
    case "externalEuint256":
      return "add256";
    case "externalEaddress":
      return "addAddress";
    default:
      console.warn(`Unknown internalType: ${internalType}, defaulting to add32`);
      return "add32";
  }
};

// Convert value to hex string
export const toHex = (value: string | Uint8Array): string => {
  if (typeof value === "string") {
    return value.startsWith("0x") ? value : `0x${value}`;
  }
  // value is Uint8Array
  return "0x" + Buffer.from(value).toString("hex");
};

// Build contract params from EncryptResult and ABI for a given function
export const buildParamsFromAbi = (
  enc: EncryptResult,
  abi: any[],
  functionName: string
): any[] => {
  const fn = abi.find((item: any) => item.type === "function" && item.name === functionName);
  if (!fn) throw new Error(`Function ABI not found for ${functionName}`);

  return fn.inputs.map((input: any, index: number) => {
    const raw = index === 0 ? enc.handles[0] : enc.inputProof;
    switch (input.type) {
      case "bytes32":
      case "bytes":
        return toHex(raw);
      case "uint256":
        return BigInt(raw);
      case "address":
      case "string":
        return raw;
      case "bool":
        return Boolean(raw);
      default:
        console.warn(`Unknown ABI param type ${input.type}; passing as hex`);
        return toHex(raw);
    }
  });
};

export interface UseFHEEncryptionParams {
  instance: FhevmInstance | undefined;
  ethersSigner: any;
  contractAddress?: string;
}

export const useFHEEncryption = (params: UseFHEEncryptionParams) => {
  const { instance, ethersSigner, contractAddress } = params;

  const canEncrypt = useMemo(
    () => Boolean(instance && ethersSigner && contractAddress),
    [instance, ethersSigner, contractAddress]
  );

  const encryptWith = useCallback(
    async (buildFn: (input: RelayerEncryptedInput) => void): Promise<EncryptResult | undefined> => {
      if (!instance || !ethersSigner || !contractAddress) return undefined;

      try {
        const userAddress = await ethersSigner.getAddress();
        const input = instance.createEncryptedInput(contractAddress, userAddress);
        buildFn(input);
        const enc = await input.encrypt();
        return enc;
      } catch (error) {
        console.error("Encryption failed:", error);
        throw error;
      }
    },
    [instance, ethersSigner, contractAddress]
  );

  return {
    canEncrypt,
    encryptWith,
  };
};















