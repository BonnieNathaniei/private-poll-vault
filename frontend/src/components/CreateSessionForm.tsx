import { useState, useEffect } from "react";
import { useCreateSession } from "../hooks/useGovernanceFeedback";

export function CreateSessionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { createSession, hash, isLoading, isSuccess, error: submitError, isError } = useCreateSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !startTime || !endTime) {
      setError("Please fill in all fields");
      return;
    }

    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

    try {
      console.log("Creating session with params:", {
        title,
        description,
        startTimestamp,
        endTimestamp,
        startTime: new Date(startTimestamp * 1000).toISOString(),
        endTime: new Date(endTimestamp * 1000).toISOString(),
      });
      createSession(title, description, startTimestamp, endTimestamp);
    } catch (error: any) {
      console.error("Failed to create session:", error);
      setError(error?.message || "Failed to create session. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setError(null);
  };

  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && submitError) {
      let errorMessage = "Failed to create session. ";
      
      // Try to extract meaningful error message
      const errorStr = submitError.toString();
      if (errorStr.includes("user rejected") || errorStr.includes("User rejected")) {
        errorMessage = "Transaction was rejected. Please try again.";
      } else if (errorStr.includes("insufficient funds")) {
        errorMessage = "Insufficient funds. Please add more ETH to your wallet.";
      } else if (errorStr.includes("Internal JSON-RPC error")) {
        errorMessage = "Network error. Please check:\n- Hardhat node is running\n- MetaMask is connected to localhost\n- Contract is deployed";
      } else if (errorStr.includes("Empty title")) {
        errorMessage = "Title cannot be empty.";
      } else {
        errorMessage += submitError.message || errorStr;
      }
      
      setError(errorMessage);
    }
  }, [isError, submitError]);

  return (
    <div className="glass-card rounded-2xl p-8 glass-card-hover">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Session</h2>
        </div>
        <p className="text-sm text-gray-500 ml-[3.25rem]">Start a new encrypted feedback collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Proposal Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:bg-white/80 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the proposal and feedback requirements"
            rows={3}
            className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 hover:bg-white/80 resize-none shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/80 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/80 shadow-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Session
              </>
            )}
          </span>
          {!isLoading && <div className="absolute inset-0 shimmer opacity-30"></div>}
        </button>

        {hash && (
          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-3 text-sm text-blue-800 animate-fade-in">
            <div className="font-medium mb-1">Transaction Hash:</div>
            <code className="bg-blue-100/60 px-2 py-1 rounded text-xs font-mono break-all">{hash}</code>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 text-red-700 animate-scale-in flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">Error</p>
              <p className="text-xs leading-relaxed whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-green-700 animate-scale-in flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Session created successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
}
