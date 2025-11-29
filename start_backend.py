#!/usr/bin/env python3
import subprocess
import sys
import os

# Force use of venv Python, regardless of calling environment
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
VENV_PYTHON = os.path.join(PROJECT_ROOT, ".venv", "bin", "python")

def install_requirements():
    print("Installing Python requirements...")
    try:
        subprocess.check_call([VENV_PYTHON, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def start_backend():
    print("Starting FastAPI backend server...")
    try:
        os.chdir("backend")
        subprocess.run([VENV_PYTHON, "main.py"])
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
        sys.exit(1)
