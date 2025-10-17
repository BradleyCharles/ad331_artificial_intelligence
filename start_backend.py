#!/usr/bin/env python3
"""
Startup script for the AD331 AI Course Backend
Run this script to start the FastAPI backend server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def start_backend():
    """Start the FastAPI backend server"""
    print("Starting FastAPI backend server...")
    try:
        os.chdir("backend")
        subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

if __name__ == "__main__":
    print("🚀 Starting AD331 AI Course Backend")
    print("=" * 40)
    
    if install_requirements():
        start_backend()
    else:
        print("❌ Failed to install requirements. Please check your Python environment.")
        sys.exit(1)
