#!/usr/bin/env python3
"""
Make predictions using the trained linear regression model
"""

import pandas as pd
import numpy as np
import joblib
import os

def load_model():
    """Load the trained model"""
    if not os.path.exists('best_linear_regression_model.pkl'):
        print("Error: Model file not found. Please run train_linear_regression.py first.")
        return None
    
    model = joblib.load('best_linear_regression_model.pkl')
    print("Model loaded successfully!")
    return model

def create_sample_data():
    """Create sample data for prediction"""
    print("Creating sample data for prediction...")
    
    # Sample data based on the training data characteristics
    sample_data = {
        'num_logins_last_24h': [20, 15, 25, 18, 22],
        'num_failed_logins': [3, 5, 2, 4, 1],
        'data_transfer_mb': [150.5, 89.2, 200.1, 120.8, 180.3],
        'num_file_accesses': [105, 95, 115, 100, 110],
        'avg_process_cpu_percent': [65.2, 45.8, 78.1, 52.3, 70.5],
        'num_network_connections': [45, 38, 52, 42, 48],
        'privilege_escalations': [1, 0, 2, 1, 0],
        'alert_priority': [3, 2, 4, 3, 1],
        'hour_of_day': [14, 9, 22, 16, 11],
        'day_of_week': [2, 1, 5, 3, 0]
    }
    
    df = pd.DataFrame(sample_data)
    print("Sample data created:")
    print(df)
    return df

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

def make_predictions(model, X):
    """Make predictions using the trained model"""
    print("\nMaking predictions...")
    
    # Engineer features
    X_eng = engineer_features(X)
    
    # Make predictions
    predictions = model.predict(X_eng)
    
    # Create results DataFrame
    results = X.copy()
    results['predicted_time_to_detection_min'] = predictions
    results['predicted_time_to_detection_hours'] = predictions / 60
    
    return results

def interactive_prediction():
    """Interactive prediction interface"""
    print("Interactive Time to Detection Prediction")
    print("=" * 40)
    
    model = load_model()
    if model is None:
        return
    
    while True:
        print("\nOptions:")
        print("1. Use sample data")
        print("2. Enter custom data")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            # Use sample data
            X = create_sample_data()
            results = make_predictions(model, X)
            
            print("\nPrediction Results:")
            print("=" * 50)
            for i, row in results.iterrows():
                print(f"\nSample {i+1}:")
                print(f"  Alert Priority: {row['alert_priority']}")
                print(f"  Privilege Escalations: {row['privilege_escalations']}")
                print(f"  Failed Logins: {row['num_failed_logins']}")
                print(f"  Data Transfer: {row['data_transfer_mb']:.1f} MB")
                print(f"  Predicted Detection Time: {row['predicted_time_to_detection_min']:.1f} minutes ({row['predicted_time_to_detection_hours']:.1f} hours)")
        
        elif choice == '2':
            # Custom data input
            print("\nEnter custom data (press Enter for default values):")
            
            custom_data = {}
            defaults = {
                'num_logins_last_24h': 20,
                'num_failed_logins': 3,
                'data_transfer_mb': 150.0,
                'num_file_accesses': 100,
                'avg_process_cpu_percent': 60.0,
                'num_network_connections': 45,
                'privilege_escalations': 1,
                'alert_priority': 3,
                'hour_of_day': 14,
                'day_of_week': 2
            }
            
            for feature, default in defaults.items():
                value = input(f"{feature} (default: {default}): ").strip()
                if value:
                    try:
                        custom_data[feature] = float(value)
                    except ValueError:
                        print(f"Invalid input, using default: {default}")
                        custom_data[feature] = default
                else:
                    custom_data[feature] = default
            
            X = pd.DataFrame([custom_data])
            results = make_predictions(model, X)
            
            print("\nPrediction Result:")
            print("=" * 30)
            row = results.iloc[0]
            print(f"Predicted Detection Time: {row['predicted_time_to_detection_min']:.1f} minutes ({row['predicted_time_to_detection_hours']:.1f} hours)")
            
            # Interpretation
            if row['predicted_time_to_detection_min'] < 120:
                print("🟢 Low risk - Quick detection expected")
            elif row['predicted_time_to_detection_min'] < 180:
                print("🟡 Medium risk - Moderate detection time")
            else:
                print("🔴 High risk - Slow detection expected")
        
        elif choice == '3':
            print("Goodbye!")
            break
        
        else:
            print("Invalid choice. Please try again.")

def main():
    """Main function"""
    interactive_prediction()

if __name__ == "__main__":
    main()
