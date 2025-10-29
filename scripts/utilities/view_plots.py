#!/usr/bin/env python3
"""
Quick script to view generated data visualizations
"""

import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import webbrowser
import os
from pathlib import Path

def view_static_plots():
    """Display static PNG plots"""
    plot_files = [
        'data_overview.png',
        'feature_analysis.png', 
        'correlation_heatmap.png',
        'time_analysis.png'
    ]
    
    print("Displaying static plots...")
    for plot_file in plot_files:
        if os.path.exists(plot_file):
            print(f"Opening {plot_file}...")
            img = mpimg.imread(plot_file)
            plt.figure(figsize=(12, 8))
            plt.imshow(img)
            plt.axis('off')
            plt.title(plot_file.replace('.png', '').replace('_', ' ').title())
            plt.tight_layout()
            plt.show()
        else:
            print(f"Warning: {plot_file} not found")

def open_interactive_plots():
    """Open interactive HTML plots in browser"""
    html_files = [
        'interactive_scatter_matrix.html',
        'interactive_3d_scatter.html',
        'interactive_correlation.html'
    ]
    
    print("Opening interactive plots in browser...")
    for html_file in html_files:
        if os.path.exists(html_file):
            print(f"Opening {html_file}...")
            webbrowser.open(f'file://{os.path.abspath(html_file)}')
        else:
            print(f"Warning: {html_file} not found")

def show_summary():
    """Show dataset summary"""
    print("\n" + "="*60)
    print("TIME TO DETECTION DATASET ANALYSIS SUMMARY")
    print("="*60)
    
    if os.path.exists('data_analysis_report.md'):
        with open('data_analysis_report.md', 'r') as f:
            content = f.read()
            print(content)
    else:
        print("Analysis report not found. Run visualize_data.py first.")

def main():
    """Main function"""
    print("Time to Detection Dataset Visualization Viewer")
    print("=" * 50)
    
    while True:
        print("\nOptions:")
        print("1. View static plots (PNG files)")
        print("2. Open interactive plots (HTML files)")
        print("3. Show analysis summary")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == '1':
            view_static_plots()
        elif choice == '2':
            open_interactive_plots()
        elif choice == '3':
            show_summary()
        elif choice == '4':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
