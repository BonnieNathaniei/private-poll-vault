// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  31337: { // localhost
    GovernanceFeedback: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788", // Latest Hardhat deployment
  },
  11155111: { // sepolia
    GovernanceFeedback: "", // To be filled after deployment
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;
