import { useState, useEffect } from "react";
import { useSessionInfo, useSessionResults, useRequestFinalize, useMockDecryptSession } from "../hooks/useGovernanceFeedback";
import { FeedbackForm } from "./FeedbackForm";

interface SessionCardProps {
  sessionId: number;
}

export function SessionCard({ sessionId }: SessionCardProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const sessionInfoQuery = useSessionInfo(sessionId);
  const { data: sessionInfo, isLoading: sessionInfoLoading, error: sessionInfoError } = sessionInfoQuery;
  const resultsQuery = useSessionResults(sessionId);
  const { data: results, isLoading: resultsLoading, error: resultsError } = resultsQuery;
  const { hash: finalizeHash, isSuccess: finalizeSuccess, error: finalizeError, isError: finalizeIsError } = useRequestFinalize();
  const { mockDecryptSession, hash: mockHash, isLoading: mockLoading, isSuccess: mockSuccess, error: mockError } = useMockDecryptSession();

  // Debug: Log results data
  useEffect(() => {
    if (results) {
      console.log("Session Results:", results);
    }
    if (resultsError) {
      console.error("Results Error:", resultsError);
    }
  }, [results, resultsError]);

  // Refetch data when finalize succeeds
  useEffect(() => {
    if (finalizeSuccess) {
      // Wait a bit for the transaction to be processed, then refetch
      const timer = setTimeout(() => {
        if ('refetch' in sessionInfoQuery) {
          (sessionInfoQuery as any).refetch();
        }
        if ('refetch' in resultsQuery) {
          (resultsQuery as any).refetch();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [finalizeSuccess, sessionInfoQuery, resultsQuery]);

  // Refetch data when mock decrypt succeeds
  useEffect(() => {
    if (mockSuccess) {
      // Wait a bit for the transaction to be processed, then refetch
      const timer = setTimeout(() => {
        if ('refetch' in sessionInfoQuery) {
          (sessionInfoQuery as any).refetch();
        }
        if ('refetch' in resultsQuery) {
          (resultsQuery as any).refetch();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mockSuccess, sessionInfoQuery, resultsQuery]);

  if (sessionInfoLoading || !sessionInfo) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200/60 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-200/60 rounded-lg w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200/60 rounded w-full"></div>
            <div className="h-3 bg-gray-200/60 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionInfoError) {
    console.error("Session info error:", sessionInfoError);
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="text-red-600 text-sm">
          Failed to load session #{sessionId}: {sessionInfoError.message}
        </div>
      </div>
    );
  }

  const [
    proposalTitle,
    description,
    startTime,
    endTime,
    ,
    finalized,
    feedbackCount,
  ] = sessionInfo;

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const isActive = () => {
    const now = Math.floor(Date.now() / 1000);
    return now >= Number(startTime) && now <= Number(endTime);
  };

  const canFinalize = () => {
    // Allow finalization at any time as long as there's feedback and not already finalized
    return !finalized && feedbackCount > 0;
  };


  const handleMockDecrypt = () => {
    mockDecryptSession(sessionId);
  };

  const statusConfig = finalized
    ? {
        label: "Finalized",
        className: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      }
    : isActive()
    ? {
        label: "Active",
        className: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200",
        icon: (
          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-pulse"></div>
        ),
      }
    : {
        label: "Inactive",
        className: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };

  return (
    <div className="glass-card rounded-2xl p-6 glass-card-hover group">
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1 pr-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {proposalTitle}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">{description}</p>
        </div>
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 flex-shrink-0 ${statusConfig.className}`}>
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-2.5 text-sm mb-5 bg-gray-50/50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Start:</span>
          <span className="text-gray-900 font-medium">{formatTime(startTime)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">End:</span>
          <span className="text-gray-900 font-medium">{formatTime(endTime)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-gray-600 font-medium">Participants:</span>
          <span className="font-bold text-primary-600 text-base animate-number">
            {feedbackCount.toString()}
          </span>
        </div>
      </div>

      {/* Results Display */}
      {finalized && (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200/60 rounded-xl p-5 mb-5 animate-scale-in backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-bold text-green-900">Final Results</h4>
          </div>
          {resultsLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-sm text-green-700 mt-2">Loading results...</p>
            </div>
          ) : resultsError ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-600">Error loading results: {resultsError.message}</p>
              <p className="text-xs text-gray-500 mt-1">Session may not be finalized yet or decryption pending.</p>
            </div>
          ) : results && Array.isArray(results) && results.length >= 3 ? (
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-1 animate-number">
                {results[2].toString()}/10
              </div>
              <div className="text-sm font-semibold text-green-700">Average Satisfaction Score</div>
              <div className="text-xs text-green-600 mt-2 font-medium">
                Based on {results[1].toString()} responses
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-orange-600">Decryption pending...</p>
              <p className="text-xs text-gray-500 mt-1">Results will appear once decryption is complete.</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2.5">
        {!finalized && isActive() && (
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showFeedbackForm ? "M19 9l-7 7-7-7" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
              </svg>
              {showFeedbackForm ? "Hide Feedback Form" : "Submit Feedback"}
            </span>
            {!showFeedbackForm && <div className="absolute inset-0 shimmer opacity-20"></div>}
          </button>
        )}

        {canFinalize() && (
          <button
            onClick={handleMockDecrypt}
            disabled={mockLoading || finalized}
            className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {mockLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalizing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Request Decryption (Finalize)
                </>
              )}
            </span>
            {!mockLoading && <div className="absolute inset-0 shimmer opacity-20"></div>}
          </button>
        )}
      </div>

      {/* Finalize Transaction Status */}
      {(finalizeHash || mockHash) && (
        <div className="mt-3 bg-purple-50/80 backdrop-blur-sm border border-purple-200 rounded-xl p-3 text-xs text-purple-800 animate-fade-in">
          <div className="font-medium mb-1">Finalize TX:</div>
          <code className="bg-purple-100/60 px-2 py-1 rounded text-xs font-mono break-all">{(finalizeHash || mockHash)?.slice(0, 10)}...</code>
        </div>
      )}

      {finalizeIsError && finalizeError && (
        <div className="mt-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm animate-scale-in flex items-start gap-2">
          <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium mb-1">Decryption Request Failed</p>
            <p className="text-xs">
              {(finalizeError || mockError)?.message || "Failed to request decryption. Please try again."}
            </p>
          </div>
        </div>
      )}

      {(mockSuccess || finalizeSuccess) && (
        <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm animate-scale-in flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Finalization requested! Results will be available after decryption.</span>
        </div>
      )}

      {/* Feedback Form */}
      {showFeedbackForm && (
        <div className="mt-5 pt-5 border-t border-gray-200/60 animate-slide-up">
          <FeedbackForm sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}
