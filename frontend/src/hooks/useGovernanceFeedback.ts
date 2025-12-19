import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { GovernanceFeedbackABI } from "../abi/GovernanceFeedback";

export function useSessionCount() {
  return useReadContract({
    address: CONTRACT_ADDRESSES[31337]?.GovernanceFeedback,
    abi: GovernanceFeedbackABI,
    functionName: "getSessionCount",
  });
}

export function useSessionInfo(sessionId: number) {
  const result = useReadContract({
    address: CONTRACT_ADDRESSES[31337]?.GovernanceFeedback,
    abi: GovernanceFeedbackABI,
    functionName: "getSessionInfo",
    args: sessionId !== undefined ? [BigInt(sessionId)] : undefined,
  });
  return result;
}

export function useSessionResults(sessionId: number) {
  const result = useReadContract({
    address: CONTRACT_ADDRESSES[31337]?.GovernanceFeedback,
    abi: GovernanceFeedbackABI,
    functionName: "getResults",
    args: sessionId !== undefined ? [BigInt(sessionId)] : undefined,
  });
  return result;
}

export function useCreateSession() {
  const { writeContract, data: hash, error: writeError, isError: isWriteError } = useWriteContract();

  const createSession = (title: string, description: string, startTime: number, endTime: number) => {
    const contractAddress = CONTRACT_ADDRESSES[31337]?.GovernanceFeedback;
    
    if (!contractAddress) {
      const error = new Error("Contract address not found. Please ensure the contract is deployed.");
      console.error(error);
      throw error;
    }

    console.log("Calling createSession:", {
      contractAddress,
      title,
      description,
      startTime: BigInt(startTime).toString(),
      endTime: BigInt(endTime).toString(),
    });

    try {
      writeContract({
        address: contractAddress,
        abi: GovernanceFeedbackABI,
        functionName: "createSession",
        args: [title, description, BigInt(startTime), BigInt(endTime)],
      });
    } catch (error) {
      console.error("Error calling writeContract:", error);
      throw error;
    }
  };

  const { isLoading, isSuccess, error: receiptError, isError: isReceiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const error = writeError || receiptError;
  const isError = isWriteError || isReceiptError;

  return { createSession, hash, isLoading, isSuccess, error, isError };
}

export function useSubmitFeedback() {
  const { writeContract, data: hash, error: writeError, isError: isWriteError } = useWriteContract();

  const submitFeedback = (sessionId: number, plainScore: number, inputProof: `0x${string}`) => {
    const contractAddress = CONTRACT_ADDRESSES[31337]?.GovernanceFeedback;

    if (!contractAddress) {
      const error = new Error("Contract address not found. Please ensure the contract is deployed.");
      console.error(error);
      throw error;
    }

    console.log("Calling submitFeedback:", {
      contractAddress,
      sessionId,
      plainScore,
      inputProof,
    });

    try {
      writeContract({
        address: contractAddress,
        abi: GovernanceFeedbackABI,
        functionName: "submitFeedback",
        args: [BigInt(sessionId), plainScore, inputProof],
      });
    } catch (error) {
      console.error("Error calling writeContract:", error);
      throw error;
    }
  };

  const { isLoading, isSuccess, error: receiptError, isError: isReceiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const error = writeError || receiptError;
  const isError = isWriteError || isReceiptError;

  return { submitFeedback, hash, isLoading, isSuccess, error, isError };
}

export function useRequestFinalize() {
  const { writeContract, data: hash, error: writeError, isError: isWriteError } = useWriteContract();

  const requestFinalize = (sessionId: number) => {
    const contractAddress = CONTRACT_ADDRESSES[31337]?.GovernanceFeedback;
    
    if (!contractAddress) {
      const error = new Error("Contract address not found. Please ensure the contract is deployed.");
      console.error(error);
      throw error;
    }

    console.log("Calling requestFinalize:", {
      contractAddress,
      sessionId,
    });

    try {
      writeContract({
        address: contractAddress,
        abi: GovernanceFeedbackABI,
        functionName: "requestFinalize",
        args: [BigInt(sessionId)],
      });
    } catch (error) {
      console.error("Error calling writeContract:", error);
      throw error;
    }
  };

  const { isLoading, isSuccess, error: receiptError, isError: isReceiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const error = writeError || receiptError;
  const isError = isWriteError || isReceiptError;

  return { requestFinalize, hash, isLoading, isSuccess, error, isError };
}

export function useMockDecryptSession() {
  const { writeContract, data: hash, error: writeError, isError: isWriteError } = useWriteContract();

  const mockDecryptSession = (sessionId: number) => {
    const contractAddress = CONTRACT_ADDRESSES[31337]?.GovernanceFeedback;
    
    if (!contractAddress) {
      const error = new Error("Contract address not found. Please ensure the contract is deployed.");
      console.error(error);
      throw error;
    }

    console.log("Calling mockDecryptSession:", {
      contractAddress,
      sessionId,
    });

    try {
      writeContract({
        address: contractAddress,
        abi: GovernanceFeedbackABI,
        functionName: "mockDecryptSession",
        args: [BigInt(sessionId)],
      });
    } catch (error) {
      console.error("Error calling writeContract:", error);
      throw error;
    }
  };

  const { isLoading, isSuccess, error: receiptError, isError: isReceiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const error = writeError || receiptError;
  const isError = isWriteError || isReceiptError;

  return { mockDecryptSession, hash, isLoading, isSuccess, error, isError };
}
