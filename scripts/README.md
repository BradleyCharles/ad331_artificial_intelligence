# Scripts Directory

This directory contains all Python scripts for the Time to Detection AI model project, organized by functionality.

## 📁 Directory Structure

```
scripts/
├── data_analysis/          # Data exploration and visualization scripts
├── model_training/         # Model training and evaluation scripts
├── utilities/              # Helper and utility scripts
└── README.md              # This file
```

## 📊 Data Analysis Scripts

### `data_analysis/visualize_data.py`
**Purpose**: Comprehensive data visualization and analysis
**Usage**: `python3 scripts/data_analysis/visualize_data.py`
**Outputs**:
- Static PNG visualizations (moved to `public/visualizations/static/`)
- Interactive HTML plots (moved to `public/visualizations/interactive/`)
- Analysis report (moved to `public/reports/`)

**Features**:
- Dataset overview and statistics
- Feature correlation analysis
- Time-based pattern analysis
- Interactive scatter matrices and 3D plots

## 🤖 Model Training Scripts

### `model_training/train_linear_regression.py`
**Purpose**: Train linear regression models with feature engineering
**Usage**: `python3 scripts/model_training/train_linear_regression.py`
**Outputs**:
- Trained model (moved to `public/models/`)
- Training evaluation plots
- Feature importance analysis
- Model performance summary

**Features**:
- Multiple model variants (basic, scaled, polynomial)
- Advanced feature engineering
- Cross-validation
- Comprehensive evaluation metrics

### `model_training/test_model_performance.py`
**Purpose**: Evaluate trained model on test data
**Usage**: `python3 scripts/model_training/test_model_performance.py`
**Outputs**:
- Test performance visualizations
- Detailed performance report
- Performance by priority analysis

**Features**:
- Test data evaluation
- Performance metrics calculation
- Visualization of test results
- Model quality assessment

## 🛠️ Utility Scripts

### `utilities/predict_with_model.py`
**Purpose**: Interactive model prediction interface
**Usage**: `python3 scripts/utilities/predict_with_model.py`
**Features**:
- Interactive prediction interface
- Sample data predictions
- Custom data input
- Model loading and validation

### `utilities/view_plots.py`
**Purpose**: View generated visualizations
**Usage**: `python3 scripts/utilities/view_plots.py`
**Features**:
- Display static plots
- Open interactive HTML files
- Show analysis summary
- Menu-driven interface

## 🚀 Quick Start

1. **Generate all visualizations**:
   ```bash
   python3 scripts/data_analysis/visualize_data.py
   ```

2. **Train the model**:
   ```bash
   python3 scripts/model_training/train_linear_regression.py
   ```

3. **Test model performance**:
   ```bash
   python3 scripts/model_training/test_model_performance.py
   ```

4. **Make predictions**:
   ```bash
   python3 scripts/utilities/predict_with_model.py
   ```

5. **View plots**:
   ```bash
   python3 scripts/utilities/view_plots.py
   ```

## 📋 Requirements

All scripts require the following Python packages:
- pandas
- numpy
- matplotlib
- seaborn
- plotly
- scikit-learn
- joblib

Install with:
```bash
pip install pandas numpy matplotlib seaborn plotly scikit-learn joblib
```

## 📁 Output Organization

Scripts automatically organize their outputs:
- **Models** → `public/models/`
- **Static plots** → `public/visualizations/static/`
- **Interactive plots** → `public/visualizations/interactive/`
- **Reports** → `public/reports/`

## 🔧 Customization

Each script is well-documented and can be easily customized:
- Modify feature engineering in training scripts
- Adjust visualization parameters in analysis scripts
- Add new model types or evaluation metrics
- Extend prediction capabilities

## 📞 Support

For questions about specific scripts, check the docstrings and comments within each file. All scripts include comprehensive error handling and user guidance.
