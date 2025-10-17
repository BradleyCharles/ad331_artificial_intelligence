#!/usr/bin/env python3
"""
Startup script for the AD331 AI Course Platform
Starts both the Next.js frontend and FastAPI backend simultaneously
"""

import subprocess
import sys
import os
import time
import threading
import signal
import platform

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_banner():
    """Print the startup banner"""
    banner = f"""
{Colors.CYAN}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                    AD331 AI Course Platform                  ║
║                                                              ║
║  🚀 Starting Frontend (Next.js) and Backend (FastAPI)        ║
║  📚 Artificial Intelligence Learning Platform                ║
╚══════════════════════════════════════════════════════════════╝
{Colors.END}
"""
    print(banner)

def check_requirements():
    """Check if required tools are installed"""
    print(f"{Colors.YELLOW}🔍 Checking requirements...{Colors.END}")
    
    # Check Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"{Colors.GREEN}✅ Node.js: {result.stdout.strip()}{Colors.END}")
        else:
            print(f"{Colors.RED}❌ Node.js not found. Please install Node.js{Colors.END}")
            return False
    except FileNotFoundError:
        print(f"{Colors.RED}❌ Node.js not found. Please install Node.js{Colors.END}")
        return False
    
    # Check Python
    try:
        result = subprocess.run([sys.executable, '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"{Colors.GREEN}✅ Python: {result.stdout.strip()}{Colors.END}")
        else:
            print(f"{Colors.RED}❌ Python not found{Colors.END}")
            return False
    except FileNotFoundError:
        print(f"{Colors.RED}❌ Python not found{Colors.END}")
        return False
    
    return True

def install_dependencies():
    """Install dependencies for both frontend and backend"""
    print(f"{Colors.YELLOW}📦 Installing dependencies...{Colors.END}")
    
    # Install Node.js dependencies
    print(f"{Colors.BLUE}Installing Node.js dependencies...{Colors.END}")
    try:
        subprocess.run(['npm', 'install'], check=True)
        print(f"{Colors.GREEN}✅ Node.js dependencies installed{Colors.END}")
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}❌ Failed to install Node.js dependencies{Colors.END}")
        return False
    
    # Install Python dependencies
    print(f"{Colors.BLUE}Installing Python dependencies...{Colors.END}")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'backend/requirements.txt'], check=True)
        print(f"{Colors.GREEN}✅ Python dependencies installed{Colors.END}")
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}❌ Failed to install Python dependencies{Colors.END}")
        return False
    
    return True

def start_backend():
    """Start the FastAPI backend server"""
    print(f"{Colors.PURPLE}🚀 Starting FastAPI backend on http://localhost:8000{Colors.END}")
    try:
        os.chdir('backend')
        subprocess.run([sys.executable, 'main.py'])
    except KeyboardInterrupt:
        print(f"{Colors.YELLOW}🛑 Backend server stopped{Colors.END}")
    except Exception as e:
        print(f"{Colors.RED}❌ Error starting backend: {e}{Colors.END}")

def start_frontend():
    """Start the Next.js frontend server"""
    print(f"{Colors.CYAN}🎨 Starting Next.js frontend on http://localhost:3000{Colors.END}")
    try:
        subprocess.run(['npm', 'run', 'dev'])
    except KeyboardInterrupt:
        print(f"{Colors.YELLOW}🛑 Frontend server stopped{Colors.END}")
    except Exception as e:
        print(f"{Colors.RED}❌ Error starting frontend: {e}{Colors.END}")

def signal_handler(signum, frame):
    """Handle Ctrl+C gracefully"""
    print(f"\n{Colors.YELLOW}🛑 Shutting down servers...{Colors.END}")
    sys.exit(0)

def main():
    """Main function to start both servers"""
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print_banner()
    
    # Check requirements
    if not check_requirements():
        print(f"{Colors.RED}❌ Requirements check failed. Please install missing dependencies.{Colors.END}")
        sys.exit(1)
    
    # Ask user if they want to install dependencies
    install_deps = input(f"{Colors.YELLOW}Do you want to install/update dependencies? (y/N): {Colors.END}").lower().strip()
    if install_deps in ['y', 'yes']:
        if not install_dependencies():
            print(f"{Colors.RED}❌ Failed to install dependencies. Exiting.{Colors.END}")
            sys.exit(1)
    
    print(f"\n{Colors.GREEN}🎉 Starting servers...{Colors.END}")
    print(f"{Colors.WHITE}Press Ctrl+C to stop both servers{Colors.END}\n")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Give backend time to start
    time.sleep(2)
    
    # Start frontend in the main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}🛑 Shutting down...{Colors.END}")

if __name__ == "__main__":
    main()
