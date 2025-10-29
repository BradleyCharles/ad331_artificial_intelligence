# Time to Detection AI Model Project

## 🎯 Project Overview
A comprehensive AI model training project for predicting security incident detection times using machine learning. Features data analysis, model training, evaluation, and an interactive web dashboard.

## 📊 Model Performance
- **R² Score**: 0.8047 (80.47% variance explained)
- **Accuracy**: 97% of predictions within 20% of actual values
- **Model Type**: Linear Regression with advanced feature engineering
- **Dataset**: 1,000 samples (800 training, 200 test)

## 🏗️ Project Structure

```
ad331_artificial_intelligence/
├── 📁 scripts/                    # All Python scripts (organized)
│   ├── data_analysis/            # Data exploration & visualization
│   ├── model_training/           # Model training & evaluation
│   ├── utilities/                # Helper scripts
│   └── README.md                 # Script documentation
├── 📁 public/                     # Generated files (organized)
│   ├── models/                   # Trained ML models
│   ├── reports/                  # Analysis reports
│   └── visualizations/           # All plots and charts
│       ├── static/              # PNG visualizations
│       └── interactive/         # HTML interactive plots
├── 📁 src/app/week2/             # Web interface
│   ├── page.tsx                 # Main dashboard
│   ├── scatter-matrix/          # Interactive scatter matrix
│   ├── 3d-scatter/              # 3D scatter plot
│   └── correlation/             # Correlation heatmap
├── 📁 test_data/                 # Dataset
│   ├── time_to_detection_train.csv
│   └── time_to_detection_test.csv
├── run_analysis.py              # Quick launcher script
├── start_all.sh                 # Start web app + backend
└── PROJECT_OVERVIEW.md          # This file
```

## 🚀 Quick Start

### 1. Run Complete Analysis
```bash
python3 run_analysis.py
```
Interactive menu to run all scripts in sequence.

### 2. Start Web Application
```bash
./start_all.sh
```
Starts both the Next.js frontend and Python backend.

### 3. Access Web Dashboard
Navigate to `http://localhost:3000/week2` for the full dashboard.

## 📋 Individual Scripts

### Data Analysis
```bash
python3 scripts/data_analysis/visualize_data.py
```
- Generates comprehensive visualizations
- Creates interactive HTML plots
- Produces analysis reports

### Model Training
```bash
python3 scripts/model_training/train_linear_regression.py
```
- Trains multiple model variants
- Performs feature engineering
- Evaluates model performance

### Model Testing
```bash
python3 scripts/model_training/test_model_performance.py
```
- Tests model on test data
- Generates performance metrics
- Creates test visualizations

### Utilities
```bash
python3 scripts/utilities/predict_with_model.py  # Interactive predictions
python3 scripts/utilities/view_plots.py         # View generated plots
```

## 🌐 Web Interface Features

### Main Dashboard (`/week2`)
- Dataset overview and statistics
- Model performance metrics
- Feature analysis results
- Links to all visualizations

### Interactive Visualizations
- **Scatter Matrix** (`/week2/scatter-matrix`) - Feature relationships
- **3D Scatter Plot** (`/week2/3d-scatter`) - 3D feature visualization
- **Correlation Heatmap** (`/week2/correlation`) - Feature correlations

## 📊 Generated Outputs

### Models
- `best_linear_regression_model.pkl` - Trained model ready for use

### Reports
- `data_analysis_report.md` - Comprehensive data analysis
- `model_results_summary.txt` - Training results
- `model_test_performance_report.md` - Test performance details

### Visualizations
- **Static (PNG)**: Dataset overview, feature analysis, correlation heatmap, time analysis, model evaluation, feature importance, test performance
- **Interactive (HTML)**: Scatter matrix, 3D scatter plot, correlation heatmap

## 🔧 Technical Details

### Dependencies
- Python 3.13+
- pandas, numpy, matplotlib, seaborn, plotly
- scikit-learn, joblib
- Next.js, React, TypeScript

### Key Features
- Advanced feature engineering
- Multiple model evaluation
- Cross-validation
- Interactive visualizations
- Responsive web interface
- Clean, organized codebase

## 📈 Model Insights

### Top Predictive Features
1. **Alert Priority** (0.622 correlation)
2. **Privilege Escalations** (0.599 correlation)
3. **Average CPU Percent** (0.285 correlation)
4. **Failed Logins** (0.236 correlation)
5. **Data Transfer** (0.209 correlation)

### Performance by Priority
- All priority levels achieve good prediction accuracy
- Higher priority alerts show slightly better R² scores
- Consistent performance across different security scenarios

## 🎯 Use Cases
- Security incident response planning
- Detection time optimization
- Risk assessment and prioritization
- Security team resource allocation
- Incident response training

## 📞 Support
- Check `scripts/README.md` for detailed script documentation
- All scripts include comprehensive error handling
- Web interface provides intuitive navigation and explanations
