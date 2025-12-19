import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./config/wagmi";
import { SessionList } from "./components/SessionList";
import { CreateSessionForm } from "./components/CreateSessionForm";
import { WalletButton } from "./components/WalletButton";
import { NetworkIndicator } from "./components/NetworkIndicator";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen relative">
            {/* Header with glass effect */}
            <header className="glass-card sticky top-0 z-50 border-b border-white/20">
              <div className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gradient bg-clip-text">
                      Private Pool Vault
                    </h1>
                    <p className="text-sm text-gray-600 font-medium">
                      Encrypted Governance Feedback System
                    </p>
                    <div className="mt-2">
                      <NetworkIndicator />
                    </div>
                  </div>
                  <WalletButton />
                </div>
              </div>
            </header>

            {/* Main content with improved spacing */}
            <main className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 animate-fade-in">
                <div className="lg:col-span-4 xl:col-span-3">
                  <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <CreateSessionForm />
                  </div>
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                  <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <SessionList />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
