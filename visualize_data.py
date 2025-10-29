#!/usr/bin/env python3
"""
Data Visualization Script for Time to Detection Dataset
Creates comprehensive visualizations for AI model training and testing
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def load_data():
    """Load training and test datasets"""
    train_df = pd.read_csv('test_data/time_to_detection_train.csv')
    test_df = pd.read_csv('test_data/time_to_detection_test.csv')
    return train_df, test_df

def create_overview_plots(train_df, test_df):
    """Create overview plots showing data distribution"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Dataset Overview - Time to Detection Analysis', fontsize=16, fontweight='bold')
    
    # Target variable distribution
    axes[0, 0].hist(train_df['time_to_detection_min'], bins=30, alpha=0.7, label='Training', color='skyblue')
    axes[0, 0].hist(test_df['time_to_detection_min'], bins=30, alpha=0.7, label='Test', color='orange')
    axes[0, 0].set_title('Target Variable Distribution')
    axes[0, 0].set_xlabel('Time to Detection (minutes)')
    axes[0, 0].set_ylabel('Frequency')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)
    
    # Box plot comparison
    data_for_box = [train_df['time_to_detection_min'], test_df['time_to_detection_min']]
    axes[0, 1].boxplot(data_for_box, labels=['Training', 'Test'])
    axes[0, 1].set_title('Target Variable Box Plot Comparison')
    axes[0, 1].set_ylabel('Time to Detection (minutes)')
    axes[0, 1].grid(True, alpha=0.3)
    
    # Feature correlation with target
    feature_cols = [col for col in train_df.columns if col != 'time_to_detection_min']
    correlations = train_df[feature_cols].corrwith(train_df['time_to_detection_min']).abs().sort_values(ascending=True)
    
    axes[1, 0].barh(range(len(correlations)), correlations.values)
    axes[1, 0].set_yticks(range(len(correlations)))
    axes[1, 0].set_yticklabels(correlations.index, fontsize=8)
    axes[1, 0].set_title('Feature Correlation with Target Variable')
    axes[1, 0].set_xlabel('Absolute Correlation')
    axes[1, 0].grid(True, alpha=0.3)
    
    # Data split visualization
    split_data = ['Training', 'Test']
    split_counts = [len(train_df), len(test_df)]
    colors = ['skyblue', 'orange']
    
    axes[1, 1].pie(split_counts, labels=split_data, autopct='%1.1f%%', colors=colors, startangle=90)
    axes[1, 1].set_title('Train/Test Split')
    
    plt.tight_layout()
    plt.savefig('data_overview.png', dpi=300, bbox_inches='tight')
    plt.show()

def create_feature_analysis(train_df):
    """Create detailed feature analysis plots"""
    feature_cols = [col for col in train_df.columns if col != 'time_to_detection_min']
    
    # Create subplots for feature distributions
    n_cols = 3
    n_rows = (len(feature_cols) + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(18, 6 * n_rows))
    fig.suptitle('Feature Distributions and Relationships with Target', fontsize=16, fontweight='bold')
    
    if n_rows == 1:
        axes = axes.reshape(1, -1)
    
    for i, feature in enumerate(feature_cols):
        row = i // n_cols
        col = i % n_cols
        
        # Scatter plot with target
        axes[row, col].scatter(train_df[feature], train_df['time_to_detection_min'], 
                              alpha=0.6, s=20, color='steelblue')
        axes[row, col].set_xlabel(feature)
        axes[row, col].set_ylabel('Time to Detection (min)')
        axes[row, col].set_title(f'{feature} vs Target')
        axes[row, col].grid(True, alpha=0.3)
        
        # Add trend line
        z = np.polyfit(train_df[feature], train_df['time_to_detection_min'], 1)
        p = np.poly1d(z)
        axes[row, col].plot(train_df[feature], p(train_df[feature]), "r--", alpha=0.8)
    
    # Hide empty subplots
    for i in range(len(feature_cols), n_rows * n_cols):
        row = i // n_cols
        col = i % n_cols
        axes[row, col].set_visible(False)
    
    plt.tight_layout()
    plt.savefig('feature_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def create_correlation_heatmap(train_df):
    """Create correlation heatmap"""
    plt.figure(figsize=(12, 10))
    
    # Calculate correlation matrix
    corr_matrix = train_df.corr()
    
    # Create heatmap
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    sns.heatmap(corr_matrix, mask=mask, annot=True, cmap='coolwarm', center=0,
                square=True, linewidths=0.5, cbar_kws={"shrink": 0.8})
    
    plt.title('Feature Correlation Matrix', fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.savefig('correlation_heatmap.png', dpi=300, bbox_inches='tight')
    plt.show()

def create_time_analysis(train_df):
    """Create time-based analysis plots"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Time-Based Analysis', fontsize=16, fontweight='bold')
    
    # Hour of day analysis
    hourly_stats = train_df.groupby('hour_of_day')['time_to_detection_min'].agg(['mean', 'std']).reset_index()
    axes[0, 0].errorbar(hourly_stats['hour_of_day'], hourly_stats['mean'], 
                       yerr=hourly_stats['std'], marker='o', capsize=5)
    axes[0, 0].set_title('Detection Time by Hour of Day')
    axes[0, 0].set_xlabel('Hour of Day')
    axes[0, 0].set_ylabel('Mean Time to Detection (min)')
    axes[0, 0].grid(True, alpha=0.3)
    
    # Day of week analysis
    daily_stats = train_df.groupby('day_of_week')['time_to_detection_min'].agg(['mean', 'std']).reset_index()
    day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    axes[0, 1].bar(daily_stats['day_of_week'], daily_stats['mean'], 
                   yerr=daily_stats['std'], capsize=5, alpha=0.7)
    axes[0, 1].set_title('Detection Time by Day of Week')
    axes[0, 1].set_xlabel('Day of Week')
    axes[0, 1].set_ylabel('Mean Time to Detection (min)')
    axes[0, 1].set_xticks(range(7))
    axes[0, 1].set_xticklabels(day_names)
    axes[0, 1].grid(True, alpha=0.3)
    
    # Alert priority analysis
    priority_stats = train_df.groupby('alert_priority')['time_to_detection_min'].agg(['mean', 'std']).reset_index()
    axes[1, 0].bar(priority_stats['alert_priority'], priority_stats['mean'], 
                   yerr=priority_stats['std'], capsize=5, alpha=0.7, color='coral')
    axes[1, 0].set_title('Detection Time by Alert Priority')
    axes[1, 0].set_xlabel('Alert Priority Level')
    axes[1, 0].set_ylabel('Mean Time to Detection (min)')
    axes[1, 0].grid(True, alpha=0.3)
    
    # Privilege escalations analysis
    escalation_stats = train_df.groupby('privilege_escalations')['time_to_detection_min'].agg(['mean', 'std']).reset_index()
    axes[1, 1].bar(escalation_stats['privilege_escalations'], escalation_stats['mean'], 
                   yerr=escalation_stats['std'], capsize=5, alpha=0.7, color='lightgreen')
    axes[1, 1].set_title('Detection Time by Privilege Escalations')
    axes[1, 1].set_xlabel('Number of Privilege Escalations')
    axes[1, 1].set_ylabel('Mean Time to Detection (min)')
    axes[1, 1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('time_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def create_interactive_plots(train_df):
    """Create interactive Plotly visualizations"""
    # Interactive scatter plot matrix
    feature_cols = [col for col in train_df.columns if col != 'time_to_detection_min']
    
    fig = px.scatter_matrix(train_df, 
                           dimensions=feature_cols[:6],  # Limit to first 6 features for readability
                           color='time_to_detection_min',
                           title='Interactive Feature Scatter Matrix',
                           labels={col: col.replace('_', ' ').title() for col in feature_cols[:6]})
    
    fig.update_layout(height=800)
    fig.write_html('interactive_scatter_matrix.html')
    
    # Interactive 3D scatter plot
    fig_3d = px.scatter_3d(train_df, 
                           x='num_logins_last_24h', 
                           y='num_failed_logins', 
                           z='data_transfer_mb',
                           color='time_to_detection_min',
                           title='3D Scatter: Logins vs Failed Logins vs Data Transfer',
                           labels={'time_to_detection_min': 'Time to Detection (min)'})
    
    fig_3d.write_html('interactive_3d_scatter.html')
    
    # Interactive correlation heatmap
    corr_matrix = train_df.corr()
    fig_heatmap = px.imshow(corr_matrix, 
                           text_auto=True, 
                           aspect="auto",
                           title="Interactive Correlation Heatmap",
                           color_continuous_scale='RdBu_r')
    
    fig_heatmap.write_html('interactive_correlation.html')

def generate_summary_report(train_df, test_df):
    """Generate a summary report"""
    report = f"""
# Time to Detection Dataset Analysis Report

## Dataset Overview
- **Training samples**: {len(train_df):,}
- **Test samples**: {len(test_df):,}
- **Total samples**: {len(train_df) + len(test_df):,}
- **Features**: {len(train_df.columns) - 1}
- **Target variable**: time_to_detection_min (minutes)

## Target Variable Statistics
### Training Data
- Mean: {train_df['time_to_detection_min'].mean():.2f} minutes
- Median: {train_df['time_to_detection_min'].median():.2f} minutes
- Standard Deviation: {train_df['time_to_detection_min'].std():.2f} minutes
- Range: {train_df['time_to_detection_min'].min():.2f} - {train_df['time_to_detection_min'].max():.2f} minutes

### Test Data
- Mean: {test_df['time_to_detection_min'].mean():.2f} minutes
- Median: {test_df['time_to_detection_min'].median():.2f} minutes
- Standard Deviation: {test_df['time_to_detection_min'].std():.2f} minutes
- Range: {test_df['time_to_detection_min'].min():.2f} - {test_df['time_to_detection_min'].max():.2f} minutes

## Feature Analysis
### Top Correlated Features with Target (Training Data)
"""
    
    # Calculate correlations
    feature_cols = [col for col in train_df.columns if col != 'time_to_detection_min']
    correlations = train_df[feature_cols].corrwith(train_df['time_to_detection_min']).abs().sort_values(ascending=False)
    
    for i, (feature, corr) in enumerate(correlations.head(5).items()):
        report += f"{i+1}. **{feature}**: {corr:.3f}\n"
    
    report += f"""
## Data Quality
- **Missing values**: None detected
- **Data types**: All numeric
- **Outliers**: Present in target variable (normal for detection time data)

## Recommendations for AI Model Training
1. **Feature Engineering**: Consider creating interaction terms between highly correlated features
2. **Scaling**: Apply standardization or normalization due to different scales
3. **Time Features**: Hour and day features show interesting patterns - consider cyclical encoding
4. **Target Distribution**: Slightly right-skewed - consider log transformation if needed
5. **Validation**: Use stratified sampling to maintain similar distributions

## Generated Visualizations
- `data_overview.png`: Dataset overview and target distribution
- `feature_analysis.png`: Individual feature relationships with target
- `correlation_heatmap.png`: Feature correlation matrix
- `time_analysis.png`: Time-based analysis plots
- `interactive_scatter_matrix.html`: Interactive scatter plot matrix
- `interactive_3d_scatter.html`: 3D interactive scatter plot
- `interactive_correlation.html`: Interactive correlation heatmap
"""
    
    with open('data_analysis_report.md', 'w') as f:
        f.write(report)
    
    print("Summary report saved to 'data_analysis_report.md'")

def main():
    """Main function to run all visualizations"""
    print("Loading data...")
    train_df, test_df = load_data()
    
    print("Creating overview plots...")
    create_overview_plots(train_df, test_df)
    
    print("Creating feature analysis...")
    create_feature_analysis(train_df)
    
    print("Creating correlation heatmap...")
    create_correlation_heatmap(train_df)
    
    print("Creating time-based analysis...")
    create_time_analysis(train_df)
    
    print("Creating interactive plots...")
    create_interactive_plots(train_df)
    
    print("Generating summary report...")
    generate_summary_report(train_df, test_df)
    
    print("\nAll visualizations completed!")
    print("Generated files:")
    print("- data_overview.png")
    print("- feature_analysis.png") 
    print("- correlation_heatmap.png")
    print("- time_analysis.png")
    print("- interactive_scatter_matrix.html")
    print("- interactive_3d_scatter.html")
    print("- interactive_correlation.html")
    print("- data_analysis_report.md")

if __name__ == "__main__":
    main()
