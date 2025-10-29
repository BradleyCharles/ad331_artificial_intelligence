#!/usr/bin/env python3
"""
Failed Login Attempts vs Hour of Day Analysis
Analyzes the relationship between failed login attempts and time of day
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
    """Load the dataset"""
    print("Loading data...")
    train_df = pd.read_csv('test_data/time_to_detection_train.csv')
    test_df = pd.read_csv('test_data/time_to_detection_test.csv')
    
    # Combine for comprehensive analysis
    combined_df = pd.concat([train_df, test_df], ignore_index=True)
    print(f"Loaded {len(combined_df)} total samples")
    
    return combined_df

def analyze_failed_logins_by_hour(df):
    """Analyze failed login patterns by hour of day"""
    print("Analyzing failed login patterns by hour...")
    
    # Group by hour and calculate statistics
    hourly_stats = df.groupby('hour_of_day').agg({
        'num_failed_logins': ['mean', 'std', 'median', 'max', 'count'],
        'time_to_detection_min': ['mean', 'std']
    }).round(2)
    
    # Flatten column names
    hourly_stats.columns = ['failed_logins_mean', 'failed_logins_std', 'failed_logins_median', 
                           'failed_logins_max', 'sample_count', 'detection_time_mean', 'detection_time_std']
    hourly_stats = hourly_stats.reset_index()
    
    # Add time labels
    hourly_stats['hour_label'] = hourly_stats['hour_of_day'].apply(
        lambda x: f"{x:02d}:00" if x < 24 else "00:00"
    )
    
    # Calculate risk levels
    hourly_stats['risk_level'] = pd.cut(
        hourly_stats['failed_logins_mean'],
        bins=[0, 2, 4, 6, float('inf')],
        labels=['Low', 'Medium', 'High', 'Critical'],
        include_lowest=True
    )
    
    return hourly_stats

def create_static_visualizations(df, hourly_stats):
    """Create static visualizations for failed login analysis"""
    print("Creating static visualizations...")
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('Failed Login Attempts Analysis by Hour of Day', fontsize=16, fontweight='bold')
    
    # 1. Average failed logins by hour
    axes[0, 0].bar(hourly_stats['hour_of_day'], hourly_stats['failed_logins_mean'], 
                   alpha=0.7, color='coral', edgecolor='darkred')
    axes[0, 0].set_title('Average Failed Logins by Hour')
    axes[0, 0].set_xlabel('Hour of Day')
    axes[0, 0].set_ylabel('Average Failed Login Attempts')
    axes[0, 0].set_xticks(range(0, 24, 2))
    axes[0, 0].grid(True, alpha=0.3)
    
    # Add trend line
    z = np.polyfit(hourly_stats['hour_of_day'], hourly_stats['failed_logins_mean'], 1)
    p = np.poly1d(z)
    axes[0, 0].plot(hourly_stats['hour_of_day'], p(hourly_stats['hour_of_day']), 
                    "r--", alpha=0.8, linewidth=2)
    
    # 2. Box plot of failed logins by hour (sample every 4 hours)
    sample_hours = [0, 4, 8, 12, 16, 20]
    box_data = [df[df['hour_of_day'] == hour]['num_failed_logins'].values for hour in sample_hours]
    box_labels = [f"{hour:02d}:00" for hour in sample_hours]
    
    axes[0, 1].boxplot(box_data, labels=box_labels)
    axes[0, 1].set_title('Failed Logins Distribution by Hour (Sample)')
    axes[0, 1].set_xlabel('Hour of Day')
    axes[0, 1].set_ylabel('Number of Failed Logins')
    axes[0, 1].grid(True, alpha=0.3)
    
    # 3. Risk level heatmap
    risk_pivot = hourly_stats.pivot_table(
        values='failed_logins_mean', 
        index='hour_of_day', 
        columns='risk_level', 
        fill_value=0
    )
    
    if not risk_pivot.empty:
        sns.heatmap(risk_pivot.T, annot=True, fmt='.1f', cmap='Reds', 
                   ax=axes[1, 0], cbar_kws={'label': 'Avg Failed Logins'})
        axes[1, 0].set_title('Risk Level Heatmap by Hour')
        axes[1, 0].set_xlabel('Hour of Day')
        axes[1, 0].set_ylabel('Risk Level')
    
    # 4. Failed logins vs detection time by hour
    scatter = axes[1, 1].scatter(df['hour_of_day'], df['num_failed_logins'], 
                                c=df['time_to_detection_min'], 
                                cmap='viridis', alpha=0.6, s=30)
    axes[1, 1].set_title('Failed Logins vs Detection Time by Hour')
    axes[1, 1].set_xlabel('Hour of Day')
    axes[1, 1].set_ylabel('Number of Failed Logins')
    axes[1, 1].set_xticks(range(0, 24, 2))
    axes[1, 1].grid(True, alpha=0.3)
    
    # Add colorbar
    cbar = plt.colorbar(scatter, ax=axes[1, 1])
    cbar.set_label('Detection Time (min)')
    
    plt.tight_layout()
    plt.savefig('public/visualizations/static/failed_logins_hourly_analysis.png', 
                dpi=300, bbox_inches='tight')
    plt.show()

def create_interactive_visualizations(df, hourly_stats):
    """Create interactive visualizations"""
    print("Creating interactive visualizations...")
    
    # 1. Interactive bar chart with hover details
    fig_bar = px.bar(
        hourly_stats, 
        x='hour_of_day', 
        y='failed_logins_mean',
        color='risk_level',
        color_discrete_map={'Low': 'green', 'Medium': 'yellow', 'High': 'orange', 'Critical': 'red'},
        title='Average Failed Login Attempts by Hour of Day',
        labels={'hour_of_day': 'Hour of Day', 'failed_logins_mean': 'Average Failed Logins'},
        hover_data=['failed_logins_std', 'failed_logins_max', 'sample_count', 'detection_time_mean']
    )
    
    fig_bar.update_layout(
        xaxis_title="Hour of Day",
        yaxis_title="Average Failed Login Attempts",
        showlegend=True
    )
    
    fig_bar.write_html('public/visualizations/interactive/failed_logins_hourly_bar.html')
    
    # 2. Interactive scatter plot
    fig_scatter = px.scatter(
        df, 
        x='hour_of_day', 
        y='num_failed_logins',
        color='time_to_detection_min',
        size='alert_priority',
        hover_data=['privilege_escalations', 'data_transfer_mb', 'avg_process_cpu_percent'],
        title='Failed Logins vs Hour of Day (Colored by Detection Time)',
        labels={'hour_of_day': 'Hour of Day', 'num_failed_logins': 'Failed Login Attempts'}
    )
    
    fig_scatter.update_layout(
        xaxis_title="Hour of Day",
        yaxis_title="Number of Failed Logins",
        coloraxis_colorbar_title="Detection Time (min)"
    )
    
    fig_scatter.write_html('public/visualizations/interactive/failed_logins_hourly_scatter.html')
    
    # 3. Interactive heatmap
    # Create hourly data for heatmap
    hourly_heatmap = df.groupby(['hour_of_day', 'day_of_week']).agg({
        'num_failed_logins': 'mean',
        'time_to_detection_min': 'mean'
    }).reset_index()
    
    # Pivot for heatmap
    failed_logins_heatmap = hourly_heatmap.pivot(
        index='hour_of_day', 
        columns='day_of_week', 
        values='num_failed_logins'
    )
    
    day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    fig_heatmap = px.imshow(
        failed_logins_heatmap.values,
        x=day_names,
        y=[f"{h:02d}:00" for h in failed_logins_heatmap.index],
        color_continuous_scale='Reds',
        title='Failed Login Attempts Heatmap: Hour vs Day of Week',
        labels={'x': 'Day of Week', 'y': 'Hour of Day', 'color': 'Avg Failed Logins'}
    )
    
    fig_heatmap.write_html('public/visualizations/interactive/failed_logins_heatmap.html')

def generate_insights_report(hourly_stats, df):
    """Generate insights and recommendations"""
    print("Generating insights report...")
    
    # Find peak hours
    peak_hour = hourly_stats.loc[hourly_stats['failed_logins_mean'].idxmax()]
    low_hour = hourly_stats.loc[hourly_stats['failed_logins_mean'].idxmin()]
    
    # Calculate statistics
    total_failed_logins = df['num_failed_logins'].sum()
    avg_failed_logins = df['num_failed_logins'].mean()
    
    # Risk analysis
    high_risk_hours = hourly_stats[hourly_stats['risk_level'].isin(['High', 'Critical'])]
    
    report = f"""
# Failed Login Attempts Analysis Report

## Executive Summary
Analysis of {len(df):,} security incidents reveals distinct patterns in failed login attempts throughout the day, with significant implications for security monitoring and response strategies.

## Key Findings

### Peak Risk Hours
- **Highest Risk Hour**: {peak_hour['hour_label']} ({peak_hour['failed_logins_mean']:.1f} avg failed logins)
- **Lowest Risk Hour**: {low_hour['hour_label']} ({low_hour['failed_logins_mean']:.1f} avg failed logins)
- **Risk Difference**: {peak_hour['failed_logins_mean'] - low_hour['failed_logins_mean']:.1f}x higher risk

### Overall Statistics
- **Total Failed Logins**: {total_failed_logins:,}
- **Average per Incident**: {avg_failed_logins:.1f}
- **High Risk Hours**: {len(high_risk_hours)} out of 24 hours
- **Critical Risk Hours**: {len(hourly_stats[hourly_stats['risk_level'] == 'Critical'])} hours

### Hourly Risk Distribution
"""
    
    for _, row in hourly_stats.iterrows():
        report += f"- **{row['hour_label']}**: {row['failed_logins_mean']:.1f} avg ({row['risk_level']} risk)\n"
    
    report += f"""
## Security Implications

### High-Risk Periods
The analysis reveals {len(high_risk_hours)} hours with elevated failed login activity:
"""
    
    for _, row in high_risk_hours.iterrows():
        report += f"- **{row['hour_label']}**: {row['failed_logins_mean']:.1f} avg failed logins ({row['risk_level']} risk)\n"
    
    report += f"""
### Detection Time Correlation
- Failed logins show correlation with detection time
- Higher failed login counts often lead to faster detection
- Peak hours may indicate coordinated attack attempts

## Recommendations

### 1. Enhanced Monitoring
- Increase monitoring intensity during high-risk hours
- Implement real-time alerts for failed login spikes
- Deploy additional security measures during peak periods

### 2. Resource Allocation
- Schedule security team coverage during high-risk hours
- Allocate more resources to high-risk periods
- Consider automated response systems for off-peak hours

### 3. Detection Optimization
- Focus detection algorithms on high-risk time periods
- Implement time-based risk scoring
- Use hourly patterns for threat intelligence

### 4. Training and Awareness
- Train staff on peak risk periods
- Develop time-specific response procedures
- Create awareness campaigns for high-risk hours

## Technical Details
- Analysis based on {len(df):,} security incidents
- Time range: 24-hour analysis
- Risk levels: Low (<2), Medium (2-4), High (4-6), Critical (>6)
- Detection time correlation: {df['num_failed_logins'].corr(df['time_to_detection_min']):.3f}
"""
    
    # Save report
    with open('public/reports/failed_logins_analysis_report.md', 'w') as f:
        f.write(report)
    
    print("✅ Insights report saved to 'public/reports/failed_logins_analysis_report.md'")
    
    return report

def main():
    """Main analysis function"""
    print("Failed Login Attempts vs Hour of Day Analysis")
    print("=" * 50)
    
    # Load data
    df = load_data()
    
    # Analyze patterns
    hourly_stats = analyze_failed_logins_by_hour(df)
    
    # Create visualizations
    create_static_visualizations(df, hourly_stats)
    create_interactive_visualizations(df, hourly_stats)
    
    # Generate insights
    generate_insights_report(hourly_stats, df)
    
    print("\n" + "=" * 50)
    print("✅ Failed login analysis completed!")
    print("Generated files:")
    print("- public/visualizations/static/failed_logins_hourly_analysis.png")
    print("- public/visualizations/interactive/failed_logins_hourly_bar.html")
    print("- public/visualizations/interactive/failed_logins_hourly_scatter.html")
    print("- public/visualizations/interactive/failed_logins_heatmap.html")
    print("- public/reports/failed_logins_analysis_report.md")
    print("=" * 50)

if __name__ == "__main__":
    main()
