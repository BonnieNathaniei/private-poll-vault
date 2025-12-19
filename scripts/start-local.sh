#!/bin/bash

# Start local FHEVM development environment
echo "Starting local FHEVM development environment..."

# Start Hardhat node in background
npx hardhat node &
NODE_PID=$!

# Wait for node to start
sleep 5

# Deploy contracts
echo "Deploying contracts..."
npx hardhat deploy --network localhost

echo "Local environment started!"
echo "Node PID: $NODE_PID"
echo ""
echo "To stop: kill $NODE_PID"

# Keep script running
wait $NODE_PID
