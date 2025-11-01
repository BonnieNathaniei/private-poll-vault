import { useState, useEffect, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useFhevm as useFhevmInternal } from '../fhevm/useFhevm';
import type { FhevmInstance } from '../fhevm/fhevmTypes';

export function useFhevm() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Determine FHEVM provider based on network
  const fhevmProvider = useMemo(() => {
    // Local Hardhat network
    if (chainId === 31337) {
      return "http://127.0.0.1:8545";
    }

    // Browser wallet provider for testnets/mainnet
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }

    return undefined;
  }, [chainId]);

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevmInternal({
    provider: fhevmProvider,
    chainId: chainId,
    enabled: !!fhevmProvider && !!chainId && isConnected,
  });

  const [loading, setLoading] = useState(fhevmStatus === "loading");

  useEffect(() => {
    setLoading(fhevmStatus === "loading");
  }, [fhevmStatus]);

  return { 
    fhevmInstance, 
    loading,
    status: fhevmStatus,
    error: fhevmError
  };
}

export type { FhevmInstance };

