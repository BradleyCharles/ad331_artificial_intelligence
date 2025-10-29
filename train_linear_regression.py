#!/usr/bin/env python3
"""
Linear Regression Model Training for Time to Detection Dataset
Includes data preprocessing, training, evaluation, and visualization
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.pipeline import Pipeline
import joblib
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def load_and_preprocess_data():
    """Load and preprocess the dataset"""
    print("Loading data...")
    
    # Load datasets
    train_df = pd.read_csv('test_data/time_to_detection_train.csv')
    test_df = pd.read_csv('test_data/time_to_detection_test.csv')
    
    print(f"Training data shape: {train_df.shape}")
    print(f"Test data shape: {test_df.shape}")
    
    # Separate features and target
    feature_cols = [col for col in train_df.columns if col != 'time_to_detection_min']
    
    X_train = train_df[feature_cols]
    y_train = train_df['time_to_detection_min']
    X_test = test_df[feature_cols]
    y_test = test_df['time_to_detection_min']
    
    print(f"Features: {feature_cols}")
    print(f"Target variable: time_to_detection_min")
    
    return X_train, X_test, y_train, y_test, feature_cols

def create_engineered_features(X_train, X_test):
    """Create additional engineered features"""
    print("Creating engineered features...")
    
    # Create copies to avoid modifying originals
    X_train_eng = X_train.copy()
    X_test_eng = X_test.copy()
    
    # 1. Interaction terms for highly correlated features
    X_train_eng['alert_priority_x_privilege_escalations'] = (
        X_train_eng['alert_priority'] * X_train_eng['privilege_escalations']
    )
    X_test_eng['alert_priority_x_privilege_escalations'] = (
        X_test_eng['alert_priority'] * X_test_eng['privilege_escalations']
    )
    
    # 2. CPU efficiency (CPU usage per file access)
    X_train_eng['cpu_efficiency'] = (
        X_train_eng['avg_process_cpu_percent'] / (X_train_eng['num_file_accesses'] + 1)
    )
    X_test_eng['cpu_efficiency'] = (
        X_test_eng['avg_process_cpu_percent'] / (X_test_eng['num_file_accesses'] + 1)
    )
    
    # 3. Login success rate
    X_train_eng['login_success_rate'] = (
        X_train_eng['num_logins_last_24h'] / 
        (X_train_eng['num_logins_last_24h'] + X_train_eng['num_failed_logins'] + 1)
    )
    X_test_eng['login_success_rate'] = (
        X_test_eng['num_logins_last_24h'] / 
        (X_test_eng['num_logins_last_24h'] + X_test_eng['num_failed_logins'] + 1)
    )
    
    # 4. Cyclical encoding for time features
    # Hour of day (24-hour cycle)
    X_train_eng['hour_sin'] = np.sin(2 * np.pi * X_train_eng['hour_of_day'] / 24)
    X_train_eng['hour_cos'] = np.cos(2 * np.pi * X_train_eng['hour_of_day'] / 24)
    X_test_eng['hour_sin'] = np.sin(2 * np.pi * X_test_eng['hour_of_day'] / 24)
    X_test_eng['hour_cos'] = np.cos(2 * np.pi * X_test_eng['hour_of_day'] / 24)
    
    # Day of week (7-day cycle)
    X_train_eng['day_sin'] = np.sin(2 * np.pi * X_train_eng['day_of_week'] / 7)
    X_train_eng['day_cos'] = np.cos(2 * np.pi * X_train_eng['day_of_week'] / 7)
    X_test_eng['day_sin'] = np.sin(2 * np.pi * X_test_eng['day_of_week'] / 7)
    X_test_eng['day_cos'] = np.cos(2 * np.pi * X_test_eng['day_of_week'] / 7)
    
    # 5. Risk score (combination of security indicators)
    X_train_eng['risk_score'] = (
        X_train_eng['alert_priority'] * 0.4 +
        X_train_eng['privilege_escalations'] * 0.3 +
        X_train_eng['num_failed_logins'] * 0.2 +
        (X_train_eng['data_transfer_mb'] / 100) * 0.1  # Normalize data transfer
    )
    X_test_eng['risk_score'] = (
        X_test_eng['alert_priority'] * 0.4 +
        X_test_eng['privilege_escalations'] * 0.3 +
        X_test_eng['num_failed_logins'] * 0.2 +
        (X_test_eng['data_transfer_mb'] / 100) * 0.1
    )
    
    print(f"Original features: {len(X_train.columns)}")
    print(f"Engineered features: {len(X_train_eng.columns)}")
    print(f"New features added: {len(X_train_eng.columns) - len(X_train.columns)}")
    
    return X_train_eng, X_test_eng

def train_models(X_train, X_test, y_train, y_test):
    """Train different linear regression models"""
    print("\nTraining models...")
    
    models = {}
    results = {}
    
    # 1. Basic Linear Regression (no scaling)
    print("Training basic linear regression...")
    lr_basic = LinearRegression()
    lr_basic.fit(X_train, y_train)
    models['basic_lr'] = lr_basic
    
    # 2. Linear Regression with StandardScaler
    print("Training linear regression with scaling...")
    lr_scaled = Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', LinearRegression())
    ])
    lr_scaled.fit(X_train, y_train)
    models['scaled_lr'] = lr_scaled
    
    # 3. Polynomial Features (degree 2)
    print("Training polynomial regression...")
    poly_lr = Pipeline([
        ('poly', PolynomialFeatures(degree=2, include_bias=False)),
        ('scaler', StandardScaler()),
        ('regressor', LinearRegression())
    ])
    poly_lr.fit(X_train, y_train)
    models['poly_lr'] = poly_lr
    
    # Evaluate all models
    for name, model in models.items():
        print(f"\nEvaluating {name}...")
        
        # Predictions
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        
        # Metrics
        train_mse = mean_squared_error(y_train, y_train_pred)
        test_mse = mean_squared_error(y_test, y_test_pred)
        train_mae = mean_absolute_error(y_train, y_train_pred)
        test_mae = mean_absolute_error(y_test, y_test_pred)
        train_r2 = r2_score(y_train, y_train_pred)
        test_r2 = r2_score(y_test, y_test_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
        
        results[name] = {
            'model': model,
            'train_mse': train_mse,
            'test_mse': test_mse,
            'train_mae': train_mae,
            'test_mae': test_mae,
            'train_r2': train_r2,
            'test_r2': test_r2,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'y_train_pred': y_train_pred,
            'y_test_pred': y_test_pred
        }
        
        print(f"  Train R²: {train_r2:.4f}")
        print(f"  Test R²: {test_r2:.4f}")
        print(f"  Train MSE: {train_mse:.4f}")
        print(f"  Test MSE: {test_mse:.4f}")
        print(f"  CV R²: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
    
    return models, results

def create_evaluation_plots(y_train, y_test, results):
    """Create evaluation plots"""
    print("\nCreating evaluation plots...")
    
    # Create subplots
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    fig.suptitle('Linear Regression Model Evaluation', fontsize=16, fontweight='bold')
    
    model_names = list(results.keys())
    colors = ['blue', 'red', 'green']
    
    # 1. Actual vs Predicted (Training)
    for i, (name, result) in enumerate(results.items()):
        axes[0, 0].scatter(y_train, result['y_train_pred'], alpha=0.6, 
                          label=f'{name} (R²={result["train_r2"]:.3f})', 
                          color=colors[i], s=20)
    
    axes[0, 0].plot([y_train.min(), y_train.max()], [y_train.min(), y_train.max()], 'k--', lw=2)
    axes[0, 0].set_xlabel('Actual Time to Detection (min)')
    axes[0, 0].set_ylabel('Predicted Time to Detection (min)')
    axes[0, 0].set_title('Training Set: Actual vs Predicted')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)
    
    # 2. Actual vs Predicted (Test)
    for i, (name, result) in enumerate(results.items()):
        axes[0, 1].scatter(y_test, result['y_test_pred'], alpha=0.6, 
                          label=f'{name} (R²={result["test_r2"]:.3f})', 
                          color=colors[i], s=20)
    
    axes[0, 1].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--', lw=2)
    axes[0, 1].set_xlabel('Actual Time to Detection (min)')
    axes[0, 1].set_ylabel('Predicted Time to Detection (min)')
    axes[0, 1].set_title('Test Set: Actual vs Predicted')
    axes[0, 1].legend()
    axes[0, 1].grid(True, alpha=0.3)
    
    # 3. Residuals (Test set)
    for i, (name, result) in enumerate(results.items()):
        residuals = y_test - result['y_test_pred']
        axes[0, 2].scatter(result['y_test_pred'], residuals, alpha=0.6, 
                          label=f'{name}', color=colors[i], s=20)
    
    axes[0, 2].axhline(y=0, color='k', linestyle='--')
    axes[0, 2].set_xlabel('Predicted Time to Detection (min)')
    axes[0, 2].set_ylabel('Residuals (min)')
    axes[0, 2].set_title('Residual Plot (Test Set)')
    axes[0, 2].legend()
    axes[0, 2].grid(True, alpha=0.3)
    
    # 4. R² Comparison
    model_names_clean = [name.replace('_', ' ').title() for name in model_names]
    train_r2_scores = [results[name]['train_r2'] for name in model_names]
    test_r2_scores = [results[name]['test_r2'] for name in model_names]
    
    x = np.arange(len(model_names))
    width = 0.35
    
    axes[1, 0].bar(x - width/2, train_r2_scores, width, label='Training', alpha=0.8)
    axes[1, 0].bar(x + width/2, test_r2_scores, width, label='Test', alpha=0.8)
    axes[1, 0].set_xlabel('Model')
    axes[1, 0].set_ylabel('R² Score')
    axes[1, 0].set_title('R² Score Comparison')
    axes[1, 0].set_xticks(x)
    axes[1, 0].set_xticklabels(model_names_clean, rotation=45)
    axes[1, 0].legend()
    axes[1, 0].grid(True, alpha=0.3)
    
    # 5. MSE Comparison
    train_mse_scores = [results[name]['train_mse'] for name in model_names]
    test_mse_scores = [results[name]['test_mse'] for name in model_names]
    
    axes[1, 1].bar(x - width/2, train_mse_scores, width, label='Training', alpha=0.8)
    axes[1, 1].bar(x + width/2, test_mse_scores, width, label='Test', alpha=0.8)
    axes[1, 1].set_xlabel('Model')
    axes[1, 1].set_ylabel('MSE')
    axes[1, 1].set_title('Mean Squared Error Comparison')
    axes[1, 1].set_xticks(x)
    axes[1, 1].set_xticklabels(model_names_clean, rotation=45)
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3)
    
    # 6. Cross-validation scores
    cv_means = [results[name]['cv_mean'] for name in model_names]
    cv_stds = [results[name]['cv_std'] for name in model_names]
    
    axes[1, 2].bar(x, cv_means, yerr=cv_stds, capsize=5, alpha=0.8)
    axes[1, 2].set_xlabel('Model')
    axes[1, 2].set_ylabel('CV R² Score')
    axes[1, 2].set_title('Cross-Validation R² Scores')
    axes[1, 2].set_xticks(x)
    axes[1, 2].set_xticklabels(model_names_clean, rotation=45)
    axes[1, 2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('linear_regression_evaluation.png', dpi=300, bbox_inches='tight')
    plt.show()

def analyze_feature_importance(model, feature_names):
    """Analyze feature importance for linear regression"""
    print("\nAnalyzing feature importance...")
    
    # Get coefficients
    if hasattr(model, 'coef_'):
        coefficients = model.coef_
    elif hasattr(model, 'named_steps'):
        # For pipeline models
        coefficients = model.named_steps['regressor'].coef_
    else:
        print("Cannot extract coefficients from this model type")
        return
    
    # Create feature importance DataFrame
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'coefficient': coefficients,
        'abs_coefficient': np.abs(coefficients)
    }).sort_values('abs_coefficient', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10).to_string(index=False))
    
    # Plot feature importance
    plt.figure(figsize=(12, 8))
    top_features = feature_importance.head(15)
    
    colors = ['red' if x < 0 else 'blue' for x in top_features['coefficient']]
    bars = plt.barh(range(len(top_features)), top_features['coefficient'], color=colors, alpha=0.7)
    
    plt.yticks(range(len(top_features)), top_features['feature'])
    plt.xlabel('Coefficient Value')
    plt.title('Feature Importance (Linear Regression Coefficients)')
    plt.grid(True, alpha=0.3)
    
    # Add value labels on bars
    for i, (bar, coef) in enumerate(zip(bars, top_features['coefficient'])):
        plt.text(coef + (0.1 if coef > 0 else -0.1), i, f'{coef:.3f}', 
                va='center', ha='left' if coef > 0 else 'right')
    
    plt.tight_layout()
    plt.savefig('feature_importance_lr.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    return feature_importance

def save_model_and_results(best_model, results, feature_names):
    """Save the best model and results"""
    print("\nSaving model and results...")
    
    # Find best model based on test R²
    best_model_name = max(results.keys(), key=lambda x: results[x]['test_r2'])
    best_model = results[best_model_name]['model']
    
    print(f"Best model: {best_model_name} (Test R²: {results[best_model_name]['test_r2']:.4f})")
    
    # Save model
    joblib.dump(best_model, 'best_linear_regression_model.pkl')
    print("Model saved as 'best_linear_regression_model.pkl'")
    
    # Save results summary
    summary = {
        'best_model': best_model_name,
        'test_r2': results[best_model_name]['test_r2'],
        'test_mse': results[best_model_name]['test_mse'],
        'test_mae': results[best_model_name]['test_mae'],
        'cv_mean': results[best_model_name]['cv_mean'],
        'cv_std': results[best_model_name]['cv_std']
    }
    
    with open('model_results_summary.txt', 'w') as f:
        f.write("Linear Regression Model Results Summary\n")
        f.write("=" * 40 + "\n\n")
        f.write(f"Best Model: {best_model_name}\n")
        f.write(f"Test R²: {summary['test_r2']:.4f}\n")
        f.write(f"Test MSE: {summary['test_mse']:.4f}\n")
        f.write(f"Test MAE: {summary['test_mae']:.4f}\n")
        f.write(f"CV R²: {summary['cv_mean']:.4f} (±{summary['cv_std']:.4f})\n\n")
        
        f.write("All Model Results:\n")
        f.write("-" * 20 + "\n")
        for name, result in results.items():
            f.write(f"{name}:\n")
            f.write(f"  Test R²: {result['test_r2']:.4f}\n")
            f.write(f"  Test MSE: {result['test_mse']:.4f}\n")
            f.write(f"  CV R²: {result['cv_mean']:.4f} (±{result['cv_std']:.4f})\n\n")
    
    print("Results summary saved as 'model_results_summary.txt'")

def main():
    """Main training function"""
    print("Linear Regression Model Training for Time to Detection")
    print("=" * 60)
    
    # Load and preprocess data
    X_train, X_test, y_train, y_test, feature_cols = load_and_preprocess_data()
    
    # Create engineered features
    X_train_eng, X_test_eng = create_engineered_features(X_train, X_test)
    
    # Train models
    models, results = train_models(X_train_eng, X_test_eng, y_train, y_test)
    
    # Create evaluation plots
    create_evaluation_plots(y_train, y_test, results)
    
    # Analyze feature importance for best model
    best_model_name = max(results.keys(), key=lambda x: results[x]['test_r2'])
    best_model = results[best_model_name]['model']
    feature_importance = analyze_feature_importance(best_model, X_train_eng.columns)
    
    # Save model and results
    save_model_and_results(best_model, results, X_train_eng.columns)
    
    print("\n" + "=" * 60)
    print("Training completed successfully!")
    print("Generated files:")
    print("- linear_regression_evaluation.png")
    print("- feature_importance_lr.png")
    print("- best_linear_regression_model.pkl")
    print("- model_results_summary.txt")
    print("=" * 60)

if __name__ == "__main__":
    main()
