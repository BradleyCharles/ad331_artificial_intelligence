# mnist_fnn.py
from __future__ import annotations

import numpy as np
import os

import tensorflow as tf

from tensorflow.keras import layers, models, utils

def load_and_preprocess_mnist():
    (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

    # Shapes: x_train: (60000, 28, 28), y_train: (60000,)
    # 1) Normalize pixel values to 0–1
    x_train = x_train.astype("float32") / 255.0
    x_test = x_test.astype("float32") / 255.0

    # 2) Flatten 28x28 => 784
    x_train = x_train.reshape((-1, 28 * 28))
    x_test = x_test.reshape((-1, 28 * 28))

    # 3) One-hot encode labels (0–9) => vectors of length 10
    num_classes = 10
    y_train = utils.to_categorical(y_train, num_classes)
    y_test = utils.to_categorical(y_test, num_classes)

    return (x_train, y_train), (x_test, y_test)

def build_fnn_model(hidden_units: int = 128) -> tf.keras.Model:
    model = models.Sequential([
        layers.Input(shape=(28 * 28,)),            # 784 dims
        layers.Dense(hidden_units, activation="relu"),
        layers.Dense(hidden_units, activation="relu"),
        layers.Dense(10, activation="softmax")     # 10 classes
    ])

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model

def train_and_evaluate_api(
    epochs: int = 5,
    batch_size: int = 128,
    hidden_units: int = 128,
) -> dict:
    (x_train, y_train), (x_test, y_test) = load_and_preprocess_mnist()
    model = build_fnn_model(hidden_units=hidden_units)

    history = model.fit(
        x_train, y_train,
        validation_split=0.1,
        epochs=epochs,
        batch_size=batch_size,
        verbose=0,          # quieter for API calls
    )

    test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)

    save_model(model)

    return {
        "history": history.history,
        "test_loss": float(test_loss),
        "test_accuracy": float(test_accuracy),
    }

def predict_digit(image_28x28: np.ndarray) -> dict:
    """
    image_28x28: numpy array of shape (28, 28) with pixel values 0–255 or 0–1.
    """
    model = load_model()

    # Normalize & flatten
    img = image_28x28.astype("float32")
    if img.max() > 1.0:
        img /= 255.0

    img = img.reshape((1, 28 * 28))  # batch of 1

    probs = model.predict(img, verbose=0)[0]  # shape (10,)
    predicted_class = int(np.argmax(probs))

    return {
        "predicted_class": predicted_class,
        "probabilities": probs.tolist(),
    }


import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mnist_fnn.keras")

def save_model(model: tf.keras.Model, path: str = MODEL_PATH):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    model.save(path)

def load_model(path: str = MODEL_PATH) -> tf.keras.Model:
    return tf.keras.models.load_model(path)

if __name__ == "__main__":
    result = train_and_evaluate_api(epochs=5)
    print("Test accuracy:", result["test_accuracy"])
