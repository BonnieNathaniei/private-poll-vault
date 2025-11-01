import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Private Pool" className="h-10 w-10 sm:h-12 sm:w-12 transition-transform hover:scale-105" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Private Pool</h1>
              <p className="text-xs sm:text-sm text-slate-400 hidden sm:block leading-tight">Encrypted Governance Feedback</p>
            </div>
          </div>

          {/* Wallet Connect Button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

