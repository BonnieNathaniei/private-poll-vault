# Private Pool Deployment Guide

This guide covers the deployment process for the Private Pool governance feedback system.

## Prerequisites

- Node.js 20+
- Hardhat
- Git
- Wallet with Sepolia ETH

## Environment Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:

```bash
npx hardhat vars set PRIVATE_KEY your_private_key
npx hardhat vars set INFURA_API_KEY your_infura_key
npx hardhat vars set ETHERSCAN_API_KEY your_etherscan_key
```

## Contract Deployment

### Local Testing

```bash
# Start local Hardhat node
npm run start:local

# Deploy to localhost (in another terminal)
npm run deploy:local
```

### Sepolia Testnet Deployment

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Frontend Deployment

### Local Development

```bash
cd frontend
npm install
npm run dev
```

### Production Deployment

The project is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard

## Network Configuration

### Supported Networks

- **Localhost**: Chain ID 31337 (Hardhat)
- **Sepolia**: Chain ID 11155111 (Testnet)

### Wallet Setup

1. Install MetaMask
2. Add Sepolia network
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com)

## Troubleshooting

### Common Issues

1. **Contract deployment fails**
   - Check wallet balance
   - Verify network configuration

2. **Frontend connection issues**
   - Ensure correct contract address
   - Check network settings in MetaMask

3. **FHEVM errors**
   - Verify RelayerSDK is loaded
   - Check network compatibility

## Security Considerations

- Never commit private keys to git
- Use environment variables for sensitive data
- Test thoroughly on testnets before mainnet deployment
