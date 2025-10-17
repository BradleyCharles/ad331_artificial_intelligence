@echo off
REM Windows batch script to start both frontend and backend
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    AD331 AI Course Platform                  ║
echo ║                                                              ║
echo ║  🚀 Starting Frontend (Next.js) and Backend (FastAPI)        ║
echo ║  📚 Artificial Intelligence Learning Platform                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python
    pause
    exit /b 1
)

echo ✅ Requirements check passed
echo.

REM Ask about installing dependencies
set /p install_deps="Do you want to install/update dependencies? (y/N): "
if /i "%install_deps%"=="y" (
    echo 📦 Installing Node.js dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Node.js dependencies
        pause
        exit /b 1
    )
    
    echo 📦 Installing Python dependencies...
    call pip install -r backend/requirements.txt
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Python dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🎉 Starting servers...
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in a new window
start "Backend Server" cmd /k "cd backend && python main.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting Next.js frontend on http://localhost:3000
call npm run dev

echo.
echo 🛑 Servers stopped
pause
