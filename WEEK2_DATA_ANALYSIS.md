# Week 2: Time to Detection Dataset Analysis

## Overview
This directory contains comprehensive data analysis and visualizations for the Time to Detection dataset, designed for AI model training and testing.

## Dataset Information
- **Total Samples**: 1,000 (800 training, 200 test)
- **Features**: 10 numerical features
- **Target**: Time to detection in minutes
- **Data Quality**: No missing values, all numeric

## Generated Files

### Static Visualizations (PNG)
- `data_overview.png` - Dataset overview and target distribution
- `feature_analysis.png` - Individual feature relationships with target
- `correlation_heatmap.png` - Feature correlation matrix
- `time_analysis.png` - Time-based patterns and trends

### Interactive Visualizations (HTML)
- `interactive_scatter_matrix.html` - Interactive feature scatter matrix
- `interactive_3d_scatter.html` - 3D scatter plot of key features
- `interactive_correlation.html` - Interactive correlation heatmap

### Analysis Files
- `data_analysis_report.md` - Comprehensive analysis report
- `visualize_data.py` - Script to generate all visualizations
- `view_plots.py` - Script to view generated plots

## Key Findings

### Top Correlated Features with Target
1. **Alert Priority** (0.622) - Strongest predictor
2. **Privilege Escalations** (0.599) - Second strongest
3. **Average CPU Percent** (0.285) - Moderate correlation
4. **Failed Logins** (0.236) - Moderate correlation
5. **Data Transfer (MB)** (0.209) - Weak correlation

### Target Variable Statistics
- **Mean**: ~150 minutes
- **Range**: 58-212 minutes
- **Distribution**: Relatively normal with some outliers

## AI Model Recommendations

### Preprocessing
- Apply standardization/normalization
- Consider log transformation for target
- Encode time features cyclically
- Create interaction terms for highly correlated features

### Model Selection
- Linear regression for baseline
- Random Forest for feature importance
- XGBoost for performance
- Neural networks for complex patterns

## Usage

### Generate Visualizations
```bash
python3 visualize_data.py
```

### View Plots
```bash
python3 view_plots.py
```

### View in Web Interface
Navigate to `/week2` in your Next.js application to see the comprehensive analysis dashboard.

## Next Steps
1. Review the generated visualizations
2. Implement data preprocessing based on recommendations
3. Start with baseline models (linear regression)
4. Experiment with more complex models
5. Evaluate performance on test set

## File Structure
```
├── test_data/
│   ├── time_to_detection_train.csv
│   └── time_to_detection_test.csv
├── *.png (static visualizations)
├── *.html (interactive visualizations)
├── data_analysis_report.md
├── visualize_data.py
└── view_plots.py
```
