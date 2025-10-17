#!/bin/bash
# Unix/Linux/macOS script to start both frontend and backend

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Print banner
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    AD331 AI Course Platform                  ║"
echo "║                                                              ║"
echo "║  🚀 Starting Frontend (Next.js) and Backend (FastAPI)        ║"
echo "║  📚 Artificial Intelligence Learning Platform                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python not found. Please install Python${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Requirements check passed${NC}"
echo

# Ask about installing dependencies
read -p "$(echo -e ${YELLOW}Do you want to install/update dependencies? \(y/N\): ${NC})" install_deps
if [[ $install_deps =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Node.js dependencies${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
    pip install -r backend/requirements.txt
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Python dependencies${NC}"
        exit 1
    fi
fi

echo
echo -e "${GREEN}🎉 Starting servers...${NC}"
echo -e "${WHITE}Press Ctrl+C to stop both servers${NC}"
echo

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend in background
echo -e "${PURPLE}🚀 Starting FastAPI backend on http://localhost:8000${NC}"
cd backend
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo -e "${CYAN}🎨 Starting Next.js frontend on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
