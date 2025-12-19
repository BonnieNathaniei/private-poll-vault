import { useState } from "react";
import { useSessionCount } from "../hooks/useGovernanceFeedback";
import { SessionCard } from "./SessionCard";

export function SessionList() {
  const [refreshKey, setRefreshKey] = useState(0);
  const sessionCountQuery = useSessionCount();
  const { data: sessionCount, isLoading: countLoading, error: countError } = sessionCountQuery;

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1);
    try {
      // Refetch session count
      if ('refetch' in sessionCountQuery) {
        await (sessionCountQuery as any).refetch();
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };

  if (countLoading) {
    return (
      <div className="glass-card rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (countError) {
    console.error("Session count error:", countError);
    return (
      <div className="glass-card rounded-2xl p-12">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold mb-2">Failed to load sessions</p>
          <p className="text-sm">{countError.message}</p>
        </div>
      </div>
    );
  }

  const sessions = Array.from({ length: Number(sessionCount) }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Feedback Sessions</h2>
          <p className="text-sm text-gray-500 font-medium">
            {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} available
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={countLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-xl border border-gray-200/60 hover:border-primary-300 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh sessions"
          >
            <svg 
              className={`w-5 h-5 text-gray-700 ${countLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Refresh</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">Active</span>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions yet</h3>
          <p className="text-gray-600">Create your first feedback session to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3" key={refreshKey}>
          {sessions.map((sessionId, index) => (
            <div
              key={sessionId}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SessionCard sessionId={sessionId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
