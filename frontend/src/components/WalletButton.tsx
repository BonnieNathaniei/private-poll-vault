import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletButton() {
  return (
    <div className="flex justify-end">
      <div className="relative">
        <ConnectButton />
      </div>
    </div>
  );
}
