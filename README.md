# AD331 Artificial Intelligence Course Project

A comprehensive machine learning project for predicting security incident detection times using linear regression. Features data analysis, model training, evaluation, and an interactive web dashboard.

## 🎯 Project Overview b

This project implements an end-to-end machine learning pipeline to predict the time it takes to detect security incidents. The solution includes:

- **Data Analysis**: Comprehensive exploratory data analysis with visualizations
- **Model Training**: Linear regression with advanced feature engineering
- **Model Evaluation**: Cross-validation and performance metrics
- **Web Dashboard**: Interactive Next.js frontend with visualizations
- **API Backend**: FastAPI backend for model predictions

## 📊 Model Performance

- **R² Score**: 0.8047 (80.47% variance explained)
- **Accuracy**: 97% of predictions within 20% of actual values
- **Model Type**: Linear Regression with advanced feature engineering
- **Dataset**: 1,000 samples (800 training, 200 test)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (3.13+)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ad331_artificial_intelligence
   ```

2. **Install dependencies**

   Frontend (Next.js):

   ```bash
   npm install
   ```

   Backend (Python):

   ```bash
   pip install -r backend/requirements.txt
   ```

### Running the Application

#### Option 1: Start Everything at Once (Recommended)

```bash
python3 start_all.py
```

This script will:

- Check requirements
- Optionally install/update dependencies
- Start both frontend and backend servers

#### Option 2: Manual Start

**Start Frontend:**

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

**Start Backend:**

```bash
cd backend
python main.py
```

Backend will be available at `http://localhost:8000`

#### Alternative Startup Scripts

- Linux/Mac: `./start_all.sh`
- Windows: `start_all.bat`

## 📋 Running Analysis Scripts

### Complete Analysis Pipeline

```bash
python3 run_analysis.py
```

Interactive menu to run all scripts in sequence.

### Individual Scripts

#### Data Analysis

```bash
# Generate comprehensive visualizations
python3 scripts/data_analysis/visualize_data.py

# Analyze failed logins patterns
python3 scripts/data_analysis/failed_logins_analysis.py
```

#### Model Training

```bash
# Train the linear regression model
python3 scripts/model_training/train_linear_regression.py

# Test model performance on test data
python3 scripts/model_training/test_model_performance.py
```

#### Utilities

```bash
# Interactive predictions
python3 scripts/utilities/predict_with_model.py

# View generated plots
python3 scripts/utilities/view_plots.py
```

## 🌐 Web Interface

### Main Dashboard

- **Route**: `/assignment2`
- **Features**:
  - Dataset overview and statistics
  - Model performance metrics
  - Feature analysis results
  - Links to all visualizations

### Interactive Visualizations

- **Scatter Matrix** (`/assignment2/scatter-matrix`): Feature relationships
- **3D Scatter Plot** (`/assignment2/3d-scatter`): 3D feature visualization
- **Correlation Heatmap** (`/assignment2/correlation`): Feature correlations
- **Failed Logins Analysis** (`/assignment2/failed-logins`): Failed login patterns

## 📁 Project Structure

```
ad331_artificial_intelligence/
├── assignments/                 # Weekly assignments
│   ├── week1/
│   ├── week2/
│   └── week3/
├── backend/                    # FastAPI backend
│   ├── main.py                # Backend server
│   └── requirements.txt       # Python dependencies
├── scripts/                    # Python analysis scripts
│   ├── data_analysis/         # Data exploration & visualization
│   ├── model_training/        # Model training & evaluation
│   ├── utilities/             # Helper scripts
│   └── README.md             # Script documentation
├── src/app/                    # Next.js frontend
│   ├── assignment2/          # Assignment 2 dashboard
│   │   ├── page.tsx          # Main dashboard
│   │   ├── scatter-matrix/   # Interactive scatter matrix
│   │   ├── 3d-scatter/       # 3D scatter plot
│   │   ├── correlation/      # Correlation heatmap
│   │   └── failed-logins/    # Failed logins analysis
│   └── ...                   # Other assignment pages
├── public/                     # Generated files
│   ├── models/               # Trained ML models
│   ├── reports/              # Analysis reports
│   └── visualizations/       # All plots and charts
│       ├── static/           # PNG visualizations
│       └── interactive/        # HTML interactive plots
├── test_data/                 # Dataset
│   ├── time_to_detection_train.csv
│   └── time_to_detection_test.csv
├── start_all.py              # Main startup script
├── run_analysis.py           # Analysis launcher
└── README.md                 # This file
```

## 📊 Generated Outputs

### Models

- `best_linear_regression_model.pkl`: Trained model ready for predictions

### Reports

- `data_analysis_report.md`: Comprehensive data analysis
- `model_results_summary.txt`: Training results
- `model_test_performance_report.md`: Test performance details
- `WEEK2_DATA_ANALYSIS.md`: Week 2 specific analysis

### Visualizations

**Static (PNG)**:

- Dataset overview
- Feature analysis
- Correlation heatmap
- Time analysis
- Model evaluation
- Feature importance
- Test performance
- Failed logins hourly analysis

**Interactive (HTML)**:

- Scatter matrix
- 3D scatter plot
- Correlation heatmap
- Interactive 3D scatter
- Failed logins heatmap and charts

## 🔧 Technical Stack

### Frontend

- **Framework**: Next.js 15.5.6
- **UI**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

### Backend

- **Framework**: FastAPI 0.115.2
- **Server**: Uvicorn 0.30.6
- **Validation**: Pydantic 2.9.2

### Machine Learning

- **Framework**: scikit-learn 1.5.2
- **Data Processing**: pandas 2.2.3, numpy 2.3.4
- **Visualization**: matplotlib 3.9.2, seaborn 0.13.2, plotly
- **Additional**: TensorFlow 2.20.0, PyTorch 2.9.0

## 📈 Model Insights

### Top Predictive Features

1. **Alert Priority** (0.622 correlation)
2. **Privilege Escalations** (0.599 correlation)
3. **Average CPU Percent** (0.285 correlation)
4. **Failed Logins** (0.236 correlation)
5. **Data Transfer** (0.209 correlation)

### Performance Characteristics

- All priority levels achieve good prediction accuracy
- Higher priority alerts show slightly better R² scores
- Consistent performance across different security scenarios

## 🎯 Use Cases

- Security incident response planning
- Detection time optimization
- Risk assessment and prioritization
- Security team resource allocation
- Incident response training

## 📚 Documentation

- **Project Overview**: See `PROJECT_OVERVIEW.md` for detailed project information
- **Script Documentation**: See `scripts/README.md` for script usage
- **Reports**: Check `public/reports/` for generated analysis reports

## 🔍 Development

### Building for Production

**Frontend:**

```bash
npm run build
npm start
```

### Running Tests

```bash
python3 scripts/model_training/test_model_performance.py
```

## 🤝 Contributing

This is a course project for AD331 Artificial Intelligence. For questions or issues, please refer to the course materials or contact the instructor.

## 📝 License

This project is part of an academic course and is for educational purposes.

---

**Course**: AD331 Artificial Intelligence  
**Project**: Time to Detection Prediction Model  
**Status**: Active Development
