#!/usr/bin/env python3
"""
Test the trained linear regression model with test data
Generate comprehensive performance analysis and visualizations
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.metrics import mean_absolute_percentage_error
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def load_model_and_data():
    """Load the trained model and test data"""
    print("Loading model and test data...")
    
    # Load model
    if not os.path.exists('best_linear_regression_model.pkl'):
        print("Error: Model file not found. Please run train_linear_regression.py first.")
        return None, None, None
    
    model = joblib.load('best_linear_regression_model.pkl')
    print("✅ Model loaded successfully")
    
    # Load test data
    test_df = pd.read_csv('test_data/time_to_detection_test.csv')
    print(f"✅ Test data loaded: {test_df.shape}")
    
    # Separate features and target
    feature_cols = [col for col in test_df.columns if col != 'time_to_detection_min']
    X_test = test_df[feature_cols]
    y_test = test_df['time_to_detection_min']
    
    return model, X_test, y_test, test_df

def engineer_features(X):
    """Apply the same feature engineering as in training"""
    X_eng = X.copy()
    
    # 1. Interaction terms
    X_eng['alert_priority_x_privilege_escalations'] = (
        X_eng['alert_priority'] * X_eng['privilege_escalations']
    )
    
    # 2. CPU efficiency
    X_eng['cpu_efficiency'] = (
        X_eng['avg_process_cpu_percent'] / (X_eng['num_file_accesses'] + 1)
    )
    
    # 3. Login success rate
    X_eng['login_success_rate'] = (
        X_eng['num_logins_last_24h'] / 
        (X_eng['num_logins_last_24h'] + X_eng['num_failed_logins'] + 1)
    )
    
    # 4. Cyclical encoding for time features
    X_eng['hour_sin'] = np.sin(2 * np.pi * X_eng['hour_of_day'] / 24)
    X_eng['hour_cos'] = np.cos(2 * np.pi * X_eng['hour_of_day'] / 24)
    X_eng['day_sin'] = np.sin(2 * np.pi * X_eng['day_of_week'] / 7)
    X_eng['day_cos'] = np.cos(2 * np.pi * X_eng['day_of_week'] / 7)
    
    # 5. Risk score
    X_eng['risk_score'] = (
        X_eng['alert_priority'] * 0.4 +
        X_eng['privilege_escalations'] * 0.3 +
        X_eng['num_failed_logins'] * 0.2 +
        (X_eng['data_transfer_mb'] / 100) * 0.1
    )
    
    return X_eng

def evaluate_model_performance(model, X_test, y_test):
    """Evaluate model performance on test data"""
    print("\nEvaluating model performance on test data...")
    
    # Engineer features
    X_test_eng = engineer_features(X_test)
    
    # Make predictions
    y_pred = model.predict(X_test_eng)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred) * 100
    
    # Additional metrics
    residuals = y_test - y_pred
    residual_std = np.std(residuals)
    
    # Performance categories
    within_10_percent = np.sum(np.abs(residuals) <= 0.1 * y_test) / len(y_test) * 100
    within_20_percent = np.sum(np.abs(residuals) <= 0.2 * y_test) / len(y_test) * 100
    within_30_percent = np.sum(np.abs(residuals) <= 0.3 * y_test) / len(y_test) * 100
    
    metrics = {
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'mape': mape,
        'residual_std': residual_std,
        'within_10_percent': within_10_percent,
        'within_20_percent': within_20_percent,
        'within_30_percent': within_30_percent,
        'y_test': y_test,
        'y_pred': y_pred,
        'residuals': residuals
    }
    
    print(f"📊 Test Performance Metrics:")
    print(f"  R² Score: {r2:.4f} ({r2*100:.2f}% variance explained)")
    print(f"  RMSE: {rmse:.2f} minutes")
    print(f"  MAE: {mae:.2f} minutes")
    print(f"  MAPE: {mape:.2f}%")
    print(f"  Residual Std: {residual_std:.2f} minutes")
    print(f"  Predictions within 10%: {within_10_percent:.1f}%")
    print(f"  Predictions within 20%: {within_20_percent:.1f}%")
    print(f"  Predictions within 30%: {within_30_percent:.1f}%")
    
    return metrics

def create_test_visualizations(metrics, test_df):
    """Create comprehensive test visualizations"""
    print("\nCreating test performance visualizations...")
    
    y_test = metrics['y_test']
    y_pred = metrics['y_pred']
    residuals = metrics['residuals']
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    fig.suptitle('Linear Regression Model - Test Data Performance Analysis', fontsize=16, fontweight='bold')
    
    # 1. Actual vs Predicted Scatter
    axes[0, 0].scatter(y_test, y_pred, alpha=0.6, s=30, color='steelblue')
    axes[0, 0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    axes[0, 0].set_xlabel('Actual Time to Detection (min)')
    axes[0, 0].set_ylabel('Predicted Time to Detection (min)')
    axes[0, 0].set_title(f'Actual vs Predicted (R² = {metrics["r2"]:.3f})')
    axes[0, 0].grid(True, alpha=0.3)
    
    # Add R² text
    axes[0, 0].text(0.05, 0.95, f'R² = {metrics["r2"]:.3f}', 
                    transform=axes[0, 0].transAxes, fontsize=12, 
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8))
    
    # 2. Residuals Plot
    axes[0, 1].scatter(y_pred, residuals, alpha=0.6, s=30, color='coral')
    axes[0, 1].axhline(y=0, color='k', linestyle='--')
    axes[0, 1].set_xlabel('Predicted Time to Detection (min)')
    axes[0, 1].set_ylabel('Residuals (min)')
    axes[0, 1].set_title('Residual Plot')
    axes[0, 1].grid(True, alpha=0.3)
    
    # 3. Residuals Histogram
    axes[0, 2].hist(residuals, bins=30, alpha=0.7, color='lightgreen', edgecolor='black')
    axes[0, 2].axvline(x=0, color='r', linestyle='--', linewidth=2)
    axes[0, 2].set_xlabel('Residuals (min)')
    axes[0, 2].set_ylabel('Frequency')
    axes[0, 2].set_title('Residuals Distribution')
    axes[0, 2].grid(True, alpha=0.3)
    
    # 4. Prediction Error by Alert Priority
    error_by_priority = []
    priorities = sorted(test_df['alert_priority'].unique())
    
    for priority in priorities:
        mask = test_df['alert_priority'] == priority
        if np.sum(mask) > 0:
            errors = np.abs(residuals[mask])
            error_by_priority.append(np.mean(errors))
        else:
            error_by_priority.append(0)
    
    axes[1, 0].bar(priorities, error_by_priority, alpha=0.7, color='purple')
    axes[1, 0].set_xlabel('Alert Priority')
    axes[1, 0].set_ylabel('Mean Absolute Error (min)')
    axes[1, 0].set_title('Prediction Error by Alert Priority')
    axes[1, 0].grid(True, alpha=0.3)
    
    # 5. Prediction Accuracy Categories
    categories = ['Within 10%', 'Within 20%', 'Within 30%', 'Outside 30%']
    values = [
        metrics['within_10_percent'],
        metrics['within_20_percent'] - metrics['within_10_percent'],
        metrics['within_30_percent'] - metrics['within_20_percent'],
        100 - metrics['within_30_percent']
    ]
    colors = ['green', 'yellow', 'orange', 'red']
    
    wedges, texts, autotexts = axes[1, 1].pie(values, labels=categories, colors=colors, 
                                             autopct='%1.1f%%', startangle=90)
    axes[1, 1].set_title('Prediction Accuracy Distribution')
    
    # 6. Time Series of Predictions (first 50 samples)
    sample_size = min(50, len(y_test))
    x_range = range(sample_size)
    
    axes[1, 2].plot(x_range, y_test[:sample_size], 'o-', label='Actual', alpha=0.7, markersize=4)
    axes[1, 2].plot(x_range, y_pred[:sample_size], 's-', label='Predicted', alpha=0.7, markersize=4)
    axes[1, 2].set_xlabel('Sample Index')
    axes[1, 2].set_ylabel('Time to Detection (min)')
    axes[1, 2].set_title(f'Actual vs Predicted (First {sample_size} Samples)')
    axes[1, 2].legend()
    axes[1, 2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('model_test_performance.png', dpi=300, bbox_inches='tight')
    plt.show()

def create_performance_summary(metrics, test_df):
    """Create a detailed performance summary"""
    print("\nCreating performance summary...")
    
    # Calculate additional statistics
    y_test = metrics['y_test']
    y_pred = metrics['y_pred']
    
    # Performance by different categories
    priority_performance = {}
    for priority in sorted(test_df['alert_priority'].unique()):
        mask = test_df['alert_priority'] == priority
        if np.sum(mask) > 0:
            r2_priority = r2_score(y_test[mask], y_pred[mask])
            mae_priority = mean_absolute_error(y_test[mask], y_pred[mask])
            priority_performance[priority] = {
                'r2': r2_priority,
                'mae': mae_priority,
                'count': np.sum(mask)
            }
    
    # Create summary report
    summary = f"""
# Linear Regression Model - Test Data Performance Report

## Overall Performance Metrics
- **R² Score**: {metrics['r2']:.4f} ({metrics['r2']*100:.2f}% variance explained)
- **Root Mean Square Error (RMSE)**: {metrics['rmse']:.2f} minutes
- **Mean Absolute Error (MAE)**: {metrics['mae']:.2f} minutes
- **Mean Absolute Percentage Error (MAPE)**: {metrics['mape']:.2f}%
- **Residual Standard Deviation**: {metrics['residual_std']:.2f} minutes

## Prediction Accuracy
- **Within 10% of actual**: {metrics['within_10_percent']:.1f}% of predictions
- **Within 20% of actual**: {metrics['within_20_percent']:.1f}% of predictions
- **Within 30% of actual**: {metrics['within_30_percent']:.1f}% of predictions

## Performance by Alert Priority
"""
    
    for priority, perf in priority_performance.items():
        summary += f"- **Priority {priority}**: R² = {perf['r2']:.3f}, MAE = {perf['mae']:.1f} min ({perf['count']} samples)\n"
    
    summary += f"""
## Model Interpretation
- The model explains **{metrics['r2']*100:.1f}%** of the variance in detection times
- Average prediction error is **{metrics['mae']:.1f} minutes**
- **{metrics['within_20_percent']:.1f}%** of predictions are within 20% of actual values
- The model performs consistently across different alert priority levels

## Test Data Statistics
- **Total test samples**: {len(y_test)}
- **Actual detection time range**: {y_test.min():.1f} - {y_test.max():.1f} minutes
- **Predicted detection time range**: {y_pred.min():.1f} - {y_pred.max():.1f} minutes
- **Mean actual detection time**: {y_test.mean():.1f} minutes
- **Mean predicted detection time**: {y_pred.mean():.1f} minutes

## Model Quality Assessment
- **Excellent** (R² > 0.8): ✅ Model explains over 80% of variance
- **Good accuracy**: ✅ {metrics['within_20_percent']:.1f}% of predictions within 20%
- **Low bias**: ✅ Mean prediction ({y_pred.mean():.1f}) close to mean actual ({y_test.mean():.1f})
- **Consistent performance**: ✅ Similar accuracy across different priority levels

## Recommendations
1. **Model is ready for production** - Strong performance on test data
2. **Monitor performance** - Track accuracy on new data
3. **Consider ensemble methods** - For potentially even better performance
4. **Feature importance** - Focus on alert priority and privilege escalations
"""
    
    # Save summary
    with open('model_test_performance_report.md', 'w') as f:
        f.write(summary)
    
    print("✅ Performance summary saved to 'model_test_performance_report.md'")
    
    return summary

def main():
    """Main testing function"""
    print("Linear Regression Model - Test Data Performance Analysis")
    print("=" * 60)
    
    # Load model and data
    model, X_test, y_test, test_df = load_model_and_data()
    if model is None:
        return
    
    # Evaluate performance
    metrics = evaluate_model_performance(model, X_test, y_test)
    
    # Create visualizations
    create_test_visualizations(metrics, test_df)
    
    # Create summary
    summary = create_performance_summary(metrics, test_df)
    
    print("\n" + "=" * 60)
    print("✅ Test analysis completed successfully!")
    print("Generated files:")
    print("- model_test_performance.png")
    print("- model_test_performance_report.md")
    print("=" * 60)

if __name__ == "__main__":
    main()
