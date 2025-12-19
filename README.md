# Private Pool Vault

Encrypted Governance Feedback System using FHEVM

## Overview

Private Pool Vault is a decentralized application that enables DAO members to submit encrypted feedback scores on governance proposals. The system uses Fully Homomorphic Encryption (FHE) to ensure that individual feedback remains private while allowing aggregate statistics to be computed and revealed.

## 🚀 Live Demo

Experience Private Pool Vault: [Live Demo](https://private-vote-vault.vercel.app/)

## Features

- **Encrypted Feedback Submission**: Submit satisfaction scores (1-10) with complete privacy
- **Homomorphic Computation**: Aggregate scores are calculated on encrypted data
- **Client-Side Decryption**: Results are decrypted locally using FHEVM relayer
- **Time-Bound Sessions**: Feedback collection with configurable time windows
- **Multi-Network Support**: Works on both localhost and Sepolia testnet
- **Modern Web UI**: React-based interface with RainbowKit wallet integration

## Architecture

### Smart Contracts
- `GovernanceFeedback.sol`: Main contract handling encrypted feedback sessions

### Frontend
- React + TypeScript + Vite
- RainbowKit for wallet connection
- Wagmi for Web3 interactions
- Tailwind CSS for styling
- Custom FHEVM SDK for encryption/decryption

### Testing
- Hardhat for contract testing
- Comprehensive test coverage for both local and testnet environments

## Local Development

### Prerequisites
- Node.js >= 20
- npm >= 7.0.0
- MetaMask or another Web3 wallet

### Quick Start (Recommended)

**For Windows users:**
```bash
# Double-click the batch file or run in command prompt
start-dev.bat
```

**For Linux/Mac users:**
```bash
# Make script executable and run
chmod +x start-dev.sh
./start-dev.sh
```

This will automatically:
- Install all dependencies
- Compile contracts
- Run tests
- Start Hardhat node
- Deploy contracts
- Launch frontend development server

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Start local FHEVM node**
   ```bash
   npm run node
   ```

3. **Deploy contracts** (in another terminal)
   ```bash
   npm run deploy:local
   ```

4. **Start frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## Testing

### Local Tests
```bash
npm test
```

### Sepolia Tests
```bash
npm run test:sepolia
```

## Deployment to Sepolia

1. **Set environment variables**
   ```bash
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   ```

2. **Deploy**
   ```bash
   npx hardhat deploy --network sepolia
   ```

## Project Structure

```
private-pool/
├── contracts/              # Smart contracts
�?  └── GovernanceFeedback.sol
├── deploy/                 # Deployment scripts
�?  └── 01_deploy_governance_feedback.ts
├── test/                   # Test files
�?  ├── GovernanceFeedback.ts
�?  └── GovernanceFeedbackSepolia.ts
├── tasks/                  # Hardhat tasks
�?  ├── accounts.ts
�?  └── GovernanceFeedback.ts
├── frontend/               # React frontend
�?  ├── src/
�?  �?  ├── components/    # React components
�?  �?  ├── config/        # Wagmi & contract config
�?  �?  ├── hooks/         # Custom hooks
�?  �?  ├── abi/           # Contract ABIs
�?  �?  └── fhevm-sdk/     # FHEVM encryption SDK
�?  └── public/            # Static assets
├── hardhat.config.ts      # Hardhat configuration
└── package.json           # Dependencies
```

## How to Use the Frontend

1. **Connect Wallet**: Click "连接钱包" and connect MetaMask to localhost network
2. **Create Session**: Fill out the form on the left to create a new feedback session
3. **Submit Feedback**: For active sessions, click "Submit Feedback" to provide encrypted scores
4. **Request Finalization**: After session ends, request finalization to reveal results
5. **View Results**: Finalized sessions show average scores and participant counts

### Privacy Features
- **FHEVM Integration**: Scores are encrypted using Fully Homomorphic Encryption
- **Client-Side Encryption**: Feedback is encrypted in the browser before submission
- **Privacy Preservation**: Individual responses remain completely private
- **Homomorphic Computation**: Aggregate statistics calculated on encrypted data
- **Selective Decryption**: Only authorized parties can decrypt final results

## Available Scripts

- `npm run clean` - Clean build artifacts
- `npm run compile` - Compile contracts
- `npm run test` - Run tests
- `npm run test:sepolia` - Run Sepolia integration tests
- `npm run lint` - Run linters
- `npm run node` - Start local Hardhat node
- `npm run deploy:local` - Deploy to localhost
- `npm run deploy:sepolia` - Deploy to Sepolia

## Security Considerations

- All individual scores remain encrypted on-chain
- Only aggregate results are revealed after decryption
- One submission per address enforced
- Time-bound sessions prevent late submissions
- KMS signature verification for decryption

## Technology Stack

- **Smart Contracts**: Solidity 0.8.24, FHEVM
- **FHE Library**: @fhevm/solidity
- **FHE SDK**: @zama-fhe/relayer-sdk
- **Development**: Hardhat, TypeScript
- **Frontend**: React, Vite, RainbowKit, Wagmi
- **Testing**: Chai, Mocha

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT

## Built with

- [Zama FHEVM](https://www.zama.ai/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Hardhat](https://hardhat.org/)
