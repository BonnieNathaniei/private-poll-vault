import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

// Custom localhost configuration to match Hardhat
const localhost = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Localhost', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [localhost, sepolia],
  transports: {
    [localhost.id]: http(),
    [sepolia.id]: http(),
  },
});
