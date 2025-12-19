#!/bin/bash

echo "🚀 Starting Private Pool Vault Development Environment"
echo "=================================================="

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development environment..."
    if [ ! -z "$HARDHAT_PID" ]; then
        kill $HARDHAT_PID 2>/dev/null
        echo "✅ Hardhat node stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend server stopped"
    fi
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📦 Step 2: Installing frontend dependencies..."
cd frontend && npm install && cd ..
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "🔨 Step 3: Compiling contracts..."
npm run compile
if [ $? -ne 0 ]; then
    echo "❌ Failed to compile contracts"
    exit 1
fi

echo ""
echo "🧪 Step 4: Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo ""
echo "🌐 Step 5: Starting Hardhat node..."
npm run node &
HARDHAT_PID=$!
echo "✅ Hardhat node started (PID: $HARDHAT_PID)"

# Wait for Hardhat node to start
sleep 3

echo ""
echo "📄 Step 6: Deploying contracts..."
npm run deploy:local
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy contracts"
    cleanup
    exit 1
fi

echo ""
echo "🎨 Step 7: Starting frontend development server..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔗 Hardhat Node: http://localhost:8545"
echo "📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3"
echo ""
echo "💡 Instructions:"
echo "   1. Open http://localhost:5173 in your browser"
echo "   2. Connect your wallet (MetaMask recommended)"
echo "   3. Create a feedback session"
echo "   4. Submit encrypted feedback"
echo "   5. Request finalization to see results"
echo ""
echo "⚠️  Press Ctrl+C to stop all services"

# Wait for background processes
wait
