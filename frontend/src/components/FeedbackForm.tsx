import { useState, useEffect } from "react";
import { useSubmitFeedback } from "../hooks/useGovernanceFeedback";
import { createFhevmInstance, useFHEEncryption } from "../fhevm-sdk";
import { useWagmiEthers } from "../hooks/useWagmiEthers";
import { CONTRACT_ADDRESSES } from "../config/contracts";

interface FeedbackFormProps {
  sessionId: number;
}

export function FeedbackForm({ sessionId }: FeedbackFormProps) {
  const [score, setScore] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false); // Track if score has been encrypted
  const [error, setError] = useState<string | null>(null);
  const { submitFeedback, hash, isLoading, isSuccess, error: submitError, isError } = useSubmitFeedback();

  // FHEVM setup
  const instance = createFhevmInstance(); // Use mock for demo
  const { ethersSigner } = useWagmiEthers();
  const contractAddress = CONTRACT_ADDRESSES[31337]?.GovernanceFeedback || "";
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner,
    contractAddress,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate score range
      if (score < 1 || score > 10) {
        setError("Score must be between 1 and 10");
        setIsSubmitting(false);
        return;
      }

      setIsEncrypting(true);

      // Encrypt the score using FHEVM
      const enc = await encryptWith((builder: any) => {
        builder.add8(score); // Add the score as euint8
      });

      if (!enc) {
        setError("Encryption failed. Please check FHEVM relayer connection.");
        setIsSubmitting(false);
        setIsEncrypting(false);
        return;
      }

      setIsEncrypting(false);

      // Validate inputProof format
      if (!enc.inputProof || !enc.inputProof.startsWith('0x')) {
        setError("Invalid encryption result. Please try again.");
        setIsSubmitting(false);
        setIsEncrypted(false);
        return;
      }

      // Mark as encrypted to hide the score input (before submission)
      setIsEncrypted(true);

      // Submit encrypted feedback
      try {
        submitFeedback(sessionId, score, enc.inputProof as `0x${string}`);
      } catch (submitError: any) {
        console.error("Failed to call submitFeedback:", submitError);
        setError(submitError?.message || "Failed to submit feedback. Please try again.");
        setIsSubmitting(false);
        setIsEncrypted(false); // Reset on submission error
      }

    } catch (error: any) {
      console.error("Submission failed:", error);
      setError(error?.message || "Failed to submit feedback. Please try again.");
      setIsSubmitting(false);
      setIsEncrypting(false);
      setIsEncrypted(false); // Reset encryption state on error
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset form but keep encrypted state
      setScore(5);
      setIsSubmitting(false);
      setError(null);
      // Note: We keep isEncrypted as true to maintain privacy
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && submitError) {
      let errorMessage = "Transaction failed. ";
      
      // Try to extract meaningful error message
      const errorStr = submitError.toString();
      if (errorStr.includes("user rejected") || errorStr.includes("User rejected")) {
        errorMessage = "Transaction was rejected. Please try again.";
      } else if (errorStr.includes("insufficient funds")) {
        errorMessage = "Insufficient funds. Please add more ETH to your wallet.";
      } else if (errorStr.includes("Internal JSON-RPC error")) {
        errorMessage = "Network error. Please check:\n- Hardhat node is running\n- MetaMask is connected to localhost:8545\n- Contract address is correct\n- Try refreshing the page";
      } else if (errorStr.includes("Already submitted")) {
        errorMessage = "You have already submitted feedback for this session.";
      } else if (errorStr.includes("Session finalized")) {
        errorMessage = "This session has been finalized and no longer accepts feedback.";
      } else if (errorStr.includes("Score must be between 1-10")) {
        errorMessage = "Score must be between 1 and 10.";
      } else {
        errorMessage += submitError.message || errorStr;
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
      setIsEncrypted(false); // Reset encryption state on error so user can try again
    }
  }, [isError, submitError]);

  return (
    <div className="glass-card rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Submit Feedback</h3>
          <p className="text-xs text-gray-500">Session #{sessionId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Score Input - Hidden after encryption */}
        {!isEncrypted && !isSuccess && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Satisfaction Score (1-10)
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-primary-500 
                    [&::-webkit-slider-thumb]:to-secondary-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/50
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-primary-500 [&::-moz-range-thumb]:to-secondary-500 
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      rgb(99 102 241) 0%, 
                      rgb(99 102 241) ${((score - 1) / 9) * 100}%, 
                      rgb(229 231 235) ${((score - 1) / 9) * 100}%, 
                      rgb(229 231 235) 100%)`
                  }}
                />
                <div className="min-w-[4rem] text-center bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl py-2 px-3 border border-primary-200/50">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 animate-number">
                    {score}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Very Dissatisfied
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Neutral
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Very Satisfied
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Encrypted Status - Shown after encryption */}
        {isEncrypted && (
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/60 rounded-xl p-5 backdrop-blur-sm animate-scale-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-purple-900 mb-1">Score Encrypted</p>
                <p className="text-xs text-purple-700 leading-relaxed">
                  Your satisfaction score has been encrypted using FHE and submitted to the blockchain. 
                  The score value is now hidden and will only be revealed after the session is finalized and decrypted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">Privacy Notice</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Your score will be encrypted using Fully Homomorphic Encryption (FHE) before being submitted to the blockchain. 
                Individual scores remain private, only aggregate statistics are revealed.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isSubmitting || isEncrypting || isEncrypted}
          className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isEncrypting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Encrypting Score with FHEVM...
              </>
            ) : isLoading || isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting to Blockchain...
              </>
            ) : isEncrypted ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Already Submitted (Encrypted)
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Submit Encrypted Feedback
              </>
            )}
          </span>
          {!isLoading && !isSubmitting && !isEncrypting && (
            <div className="absolute inset-0 shimmer opacity-20"></div>
          )}
        </button>

        {hash && (
          <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-xl p-3 text-sm text-green-800 animate-fade-in">
            <div className="font-medium mb-1">Transaction Hash:</div>
            <code className="bg-green-100/60 px-2 py-1 rounded text-xs font-mono break-all">{hash}</code>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 text-red-700 animate-scale-in flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">Error</p>
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-green-700 animate-scale-in flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">
              Feedback submitted successfully! Your score has been encrypted and stored securely.
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
