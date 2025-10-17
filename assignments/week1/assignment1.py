# Import NumPy for numerical operations
import numpy as np

# Import Pandas for data manipulation and analysis
import pandas as pd

# Import Matplotlib and Seaborn for data visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Set plot style for better visualizations
sns.set_style("whitegrid")

# Import common scikit-learn modules
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.datasets import load_iris


# Load the iris dataset
iris = load_iris()
# Create DataFrame from the iris dataset
# We need to use the data and feature_names from the iris dataset
output = pd.DataFrame(data=iris.data, columns=iris.feature_names)

# Add the target column
output['target'] = iris.target

print("Dataset shape:", output.shape)
print("\nFirst 5 rows:")
print(output.head())
print("\nDataset info:")
print(output.info())
print("\nStatistical summary:")
print(output.describe())
print("\nColumn names:")
print(output.columns)

# Create histogram
plt.figure(figsize=(10, 6))
plt.hist(output["sepal length (cm)"], bins=20, color="skyblue", edgecolor="black")
plt.title("Distribution of Sepal Length")
plt.xlabel("Sepal Length (cm)")
plt.ylabel("Frequency")
plt.show()

# Create box plot
plt.figure(figsize=(12, 8))
output.boxplot(column=['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)'])
plt.title("Box Plot of Iris Dataset Features")
plt.ylabel("Values (cm)")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Create scatter plot
plt.figure(figsize=(10, 8))
scatter = plt.scatter(output['sepal length (cm)'], output['sepal width (cm)'], 
                     c=output['target'], cmap='viridis', alpha=0.7)
plt.xlabel('Sepal Length (cm)')
plt.ylabel('Sepal Width (cm)')
plt.title('Sepal Length vs Sepal Width (colored by species)')
plt.colorbar(scatter, label='Species')
plt.show()