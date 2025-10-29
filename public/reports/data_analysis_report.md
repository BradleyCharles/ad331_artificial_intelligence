
# Time to Detection Dataset Analysis Report

## Dataset Overview
- **Training samples**: 800
- **Test samples**: 200
- **Total samples**: 1,000
- **Features**: 10
- **Target variable**: time_to_detection_min (minutes)

## Target Variable Statistics
### Training Data
- Mean: 150.21 minutes
- Median: 150.32 minutes
- Standard Deviation: 24.61 minutes
- Range: 58.09 - 212.24 minutes

### Test Data
- Mean: 150.72 minutes
- Median: 150.57 minutes
- Standard Deviation: 24.89 minutes
- Range: 78.56 - 208.05 minutes

## Feature Analysis
### Top Correlated Features with Target (Training Data)
1. **alert_priority**: 0.622
2. **privilege_escalations**: 0.599
3. **avg_process_cpu_percent**: 0.285
4. **num_failed_logins**: 0.236
5. **data_transfer_mb**: 0.209

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
