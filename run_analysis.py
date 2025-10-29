#!/usr/bin/env python3
"""
Quick launcher script for the Time to Detection AI model project
Run this from the project root directory
"""

import os
import sys
import subprocess
from pathlib import Path

def run_script(script_path, description):
    """Run a Python script and handle errors"""
    print(f"\n🚀 {description}")
    print("=" * 50)
    
    try:
        result = subprocess.run([sys.executable, script_path], check=True, cwd=os.getcwd())
        print(f"✅ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running {description}: {e}")
        return False
    except FileNotFoundError:
        print(f"❌ Script not found: {script_path}")
        return False

def main():
    """Main launcher function"""
    print("🎯 Time to Detection AI Model - Script Launcher")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists("test_data"):
        print("❌ Error: Please run this script from the project root directory")
        print("   (The directory containing test_data/ folder)")
        return
    
    scripts = [
        ("scripts/data_analysis/visualize_data.py", "Data Analysis & Visualization"),
        ("scripts/model_training/train_linear_regression.py", "Model Training"),
        ("scripts/model_training/test_model_performance.py", "Model Testing"),
    ]
    
    print("\nAvailable scripts:")
    for i, (script, desc) in enumerate(scripts, 1):
        print(f"  {i}. {desc}")
    print("  4. Make Predictions (Interactive)")
    print("  5. View Plots (Interactive)")
    print("  6. Run All Scripts")
    print("  0. Exit")
    
    while True:
        try:
            choice = input("\nEnter your choice (0-6): ").strip()
            
            if choice == "0":
                print("👋 Goodbye!")
                break
            elif choice == "1":
                run_script(scripts[0][0], scripts[0][1])
            elif choice == "2":
                run_script(scripts[1][0], scripts[1][1])
            elif choice == "3":
                run_script(scripts[2][0], scripts[2][1])
            elif choice == "4":
                run_script("scripts/utilities/predict_with_model.py", "Interactive Predictions")
            elif choice == "5":
                run_script("scripts/utilities/view_plots.py", "View Plots")
            elif choice == "6":
                print("\n🔄 Running all scripts in sequence...")
                success_count = 0
                for script, desc in scripts:
                    if run_script(script, desc):
                        success_count += 1
                
                print(f"\n📊 Summary: {success_count}/{len(scripts)} scripts completed successfully")
                
                if success_count == len(scripts):
                    print("🎉 All scripts completed! Check the web interface at /week2")
                else:
                    print("⚠️  Some scripts failed. Check the error messages above.")
            else:
                print("❌ Invalid choice. Please enter 0-6.")
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
