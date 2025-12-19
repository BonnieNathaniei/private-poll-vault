import { useChainId, useChains } from "wagmi";

export function NetworkIndicator() {
  const chainId = useChainId();
  const chains = useChains();

  const currentChain = chains.find(chain => chain.id === chainId);

  if (!currentChain) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg text-sm">
        <div className="relative">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="font-semibold text-red-700">Disconnected</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg text-sm">
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-75"></div>
      </div>
      <span className="font-semibold text-green-700">
        {currentChain.name}
      </span>
      <span className="text-xs text-green-600 font-mono bg-green-100/60 px-1.5 py-0.5 rounded">
        {currentChain.id}
      </span>
    </div>
  );
}
