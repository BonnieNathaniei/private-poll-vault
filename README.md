# Private Pool - Encrypted Governance Feedback System

A privacy-preserving governance feedback system using Fully Homomorphic Encryption (FHE) technology powered by Zama's FHEVM.

## Overview

Private Pool enables DAOs to collect encrypted satisfaction scores (1-10) from members after proposal execution without revealing individual votes. The system maintains complete privacy until the feedback period ends and results are collectively decrypted.

## Features

- **🔒 Privacy-First**: All satisfaction scores are encrypted on-chain using FHE
- **📊 Aggregate Results**: Calculate average scores without revealing individual feedback
- **⏰ Time-Bound Sessions**: Define start and end times for feedback collection
- **🔐 One Vote Per Member**: Prevents duplicate submissions while maintaining privacy
- **✨ Modern UI**: Beautiful React-based interface with RainbowKit wallet integration

## 🚀 Live Demo & Resources

- **Live Demo**: [https://private-vote-vault.vercel.app/](https://private-vote-vault.vercel.app/)
- **Demo Video**: [private-pool.mp4](private-pool.mp4)
- **Contract Address**: Deploy to Sepolia testnet

## Business Logic

### Encrypted Governance Feedback Flow

1. **Session Creation**: DAO admin creates a feedback session for an executed proposal
2. **Private Submission**: Members submit encrypted satisfaction scores (1-10)
3. **Secure Aggregation**: Scores are summed homomorphically on-chain
4. **Decryption**: Anyone can request decryption once feedback is submitted, revealing:
   - Total score
   - Number of participants
   - Average satisfaction score

### FHE Formula

```
average_score = Σ(encrypted_score_i) / n
```

Where all operations happen on encrypted data until final decryption.

## 🚀 Deployed Contracts

The frontend automatically detects and connects to the correct network:

**Localhost:**
- Contract Address: `0x[DEPLOYED_CONTRACT_ADDRESS]` (auto-deployed)
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545

**Sepolia Testnet:**
- Contract Address: `0x[DEPLOYED_CONTRACT_ADDRESS]` (run `npx hardhat deploy --network sepolia`)
- Chain ID: 11155111
- Explorer: [View on Etherscan](https://sepolia.etherscan.io/)
- RPC URL: https://1rpc.io/sepolia

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test
```

### Local Development

1. **Start local FHEVM node**

```bash
npx hardhat node
```

2. **Deploy contracts** (in another terminal)

```bash
npx hardhat deploy --network localhost
```

3. **Run tests**

```bash
npm run test
```

4. **Start frontend**

```bash
cd frontend
npm install
npm run dev
```

**Note**: On first load, the FHEVM SDK will be downloaded from CDN. You'll see loading indicators in the UI and console logs showing the initialization progress.

### Deploy to Sepolia Testnet

1. **Set environment variables**

```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```

2. **Deploy**

```bash
npx hardhat deploy --network sepolia
```

3. **Test on Sepolia**

```bash
npm run test:sepolia
```

## Project Structure

```
private-pool/
├── contracts/              # Smart contracts
│   └── GovernanceFeedback.sol
├── deploy/                 # Deployment scripts
│   └── 01_deploy_governance_feedback.ts
├── test/                   # Test files
│   ├── GovernanceFeedback.ts
│   └── GovernanceFeedbackSepolia.ts
├── tasks/                  # Hardhat tasks
│   ├── accounts.ts
│   └── GovernanceFeedback.ts
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Wagmi & contract config
│   │   ├── hooks/         # Custom hooks
│   │   └── abi/           # Contract ABIs
│   └── public/            # Static assets
├── hardhat.config.ts      # Hardhat configuration
└── package.json           # Dependencies
```

## Smart Contract API

### Create Feedback Session

```solidity
function createSession(
    string memory proposalTitle,
    string memory description,
    uint64 startTime,
    uint64 endTime
) external returns (uint256 sessionId)
```

### Submit Encrypted Feedback

```solidity
function submitFeedback(
    uint256 sessionId,
    externalEuint8 encryptedScore,
    bytes calldata inputProof
) external
```

### Request Finalization

```solidity
function requestFinalize(uint256 sessionId) external
```

### Get Results

```solidity
function getResults(uint256 sessionId) 
    external 
    view 
    returns (uint32 totalScore, uint256 feedbackCount, uint32 averageScore)
```

## Frontend Features

- **RainbowKit Integration**: Seamless wallet connection
- **Real-time Updates**: Track feedback submissions and results
- **Session Management**: Create and view feedback sessions
- **Encrypted Submission**: Submit scores with FHE encryption
- **Results Dashboard**: View aggregate results after decryption

## Testing

The project includes comprehensive tests for both local and testnet environments:

- **Local Tests** (`test/GovernanceFeedback.ts`): Fast tests using FHEVM mock
- **Sepolia Tests** (`test/GovernanceFeedbackSepolia.ts`): Integration tests on testnet

## Available Tasks

### View Session Data

```bash
# Get session count
npx hardhat task:getSessionCount --network sepolia

# Get session info
npx hardhat task:getSessionInfo --sessionid 0 --network sepolia

# Get results (only after finalization)
npx hardhat task:getResults --sessionid 0 --network sepolia
```

### Test Decryption Flow

```bash
# Request finalization and start KMS decryption
npx hardhat finalize --session 0 --network sepolia

# Wait 15-30 seconds, then check decryption status and results
npx hardhat test:decryption --session 0 --network sepolia
```

**⚠️ Important**: The `finalize` and `test:decryption` tasks are designed for Sepolia testnet where KMS is available.

## Security Considerations

- All individual scores remain encrypted on-chain
- Only aggregate results are revealed after decryption
- One submission per address enforced
- Time-bound sessions prevent late submissions
- KMS signature verification for decryption

## Technology Stack

- **Smart Contracts**: Solidity 0.8.24
- **FHE Library**: @fhevm/solidity
- **FHE SDK**: @zama-fhe/relayer-sdk (dynamically loaded from CDN for client-side decryption)
- **Development**: Hardhat
- **Frontend**: React + Vite + TypeScript
- **Wallet**: RainbowKit
- **Web3**: Wagmi + Ethers.js

## 🔓 Decryption Flow

The project uses **client-side decryption** for revealing aggregated results:

### How Decryption Works

1. **User Submits Encrypted Feedback**
   - Frontend encrypts satisfaction score (1-10) using FHEVM
   - Smart contract stores encrypted scores and calculates encrypted total

2. **Grant Decryption Access**
   - User calls `grantDecryptionAccess()` to authorize themselves for decryption
   - Contract grants decryption permission via `FHE.allow()`

3. **Client-Side Decryption**
   - Frontend fetches encrypted total score using authorized access
   - Browser performs decryption using `userDecrypt()` with EIP712 signature
   - ⚡ **This process takes only a few seconds**

4. **Results Storage**
   - Frontend calls `finalizeWithResults()` to store decrypted results on-chain
   - Results become publicly readable via `getResults()`

5. **Frontend Display**
   - Frontend automatically polls for results every 3 seconds
   - Once `finalized = true`, displays:
     - Total Score
     - Number of Participants  
     - Average Score (out of 10)
     - Satisfaction percentage

### Key Points

- ✅ **Permanent Storage**: Decrypted results are stored on-chain forever
- ✅ **Public Access**: Anyone can read results after finalization
- ✅ **No User Signatures**: KMS handles decryption automatically
- ⚠️ **Sepolia Only**: KMS decryption only works on Sepolia testnet (not localhost)
- ⚠️ **Async Process**: Allow 15-30 seconds for KMS callback after finalization

## Technical Features

### FHEVM SDK Implementation

The project uses `@zama-fhe/relayer-sdk` loaded dynamically from CDN to avoid WASM bundling issues:

- **Dynamic SDK Loading**: SDK loaded from `https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs`
- **No Build-Time WASM**: Eliminates WASM-related build and bundling problems
- **Automatic Initialization**: SDK initializes automatically when user connects wallet
- **Public Key Caching**: Caches public keys in localStorage for faster subsequent loads
- **Status Tracking**: Real-time loading/ready/error status display
- **Abort Support**: Operations can be cancelled when network changes

### Other Features

- **Type-Safe**: Full TypeScript implementation with proper type definitions
- **Auto Network Detection**: Automatically switches contract addresses based on connected network
- **Multi-Network Support**: Seamlessly works on both localhost (31337) and Sepolia (11155111)
- **Network Indicator**: Visual indicator showing current network and contract address

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Setup](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [RainbowKit Docs](https://www.rainbowkit.com/)

## 🤝 Contributing

We welcome contributions to Private Pool! Here's how you can help:

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/private-poll-vault.git
   cd private-pool-vault
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Start Development Environment**
   ```bash
   npm run start:local  # Terminal 1: Start Hardhat node
   npm run dev:frontend # Terminal 2: Start frontend
   ```

### Contribution Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier configurations
   - Write comprehensive tests

2. **Commit Convention**
   - Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
   - Keep commit messages clear and descriptive

3. **Testing**
   - Add unit tests for new features
   - Ensure all tests pass: `npm test`
   - Test on both localhost and Sepolia networks

### Areas for Contribution

- **Smart Contract Improvements**: Gas optimization, security enhancements
- **Frontend Features**: UI/UX improvements, new components
- **Testing**: More comprehensive test coverage
- **Documentation**: Tutorials, API docs, deployment guides

## License

MIT

## Project Status

- ✅ **Core Features**: Encrypted feedback collection and decryption
- ✅ **FHEVM Integration**: Full homomorphic encryption support
- ✅ **Frontend**: Modern React UI with wallet integration
- ✅ **Testing**: Comprehensive test suite
- ✅ **Deployment**: Vercel configuration ready

## Support

For issues and questions:
- GitHub Issues
- [Zama Discord](https://discord.gg/zama)
- [FHEVM Documentation](https://docs.zama.ai)

---

**Built with ❤️ using Zama's FHEVM technology**

