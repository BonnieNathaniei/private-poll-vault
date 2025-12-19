@echo off
echo 🚀 Starting Private Pool Vault Development Environment
echo ==================================================

echo.
echo 📦 Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Step 2: Installing frontend dependencies...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo 🔨 Step 3: Compiling contracts...
call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Failed to compile contracts
    pause
    exit /b 1
)

echo.
echo 🧪 Step 4: Running tests...
call npm test
if %errorlevel% neq 0 (
    echo ❌ Tests failed
    pause
    exit /b 1
)

echo.
echo 🌐 Step 5: Starting Hardhat node in new window...
start "Hardhat Node" cmd /k "npm run node"

echo ✅ Hardhat node starting in new window...

echo.
echo 📄 Step 6: Waiting for Hardhat node to start (5 seconds)...
timeout /t 5 /nobreak > nul

echo Deploying contracts...
call npm run deploy:local
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy contracts
    pause
    exit /b 1
)

echo.
echo 🎨 Step 7: Starting frontend development server in new window...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo ✅ Frontend server starting in new window...

echo.
echo 🎉 Development environment is ready!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔗 Hardhat Node: http://localhost:8545
echo 📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
echo.
echo 💡 Instructions:
echo    1. Open http://localhost:5173 in your browser
echo    2. Connect your wallet (MetaMask recommended)
echo    3. Create a feedback session
echo    4. Submit encrypted feedback
echo    5. Request finalization to see results
echo.
echo ⚠️  Close the command windows to stop services

pause
