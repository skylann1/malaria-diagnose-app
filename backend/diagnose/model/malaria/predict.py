# model/predict.py

import time
import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Load model sekali saja saat server dinyalakan
model = load_model("diagnose/model/malaria/malaria-cell-cnn.h5")

# Preprocessing untuk gambar malaria cell
def preprocess_image(image_path, img_size=70):
  img_arr = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
  img_resized = cv2.resize(img_arr, (img_size, img_size))
  img_resized = img_resized / 255.0
  img_resized = img_resized.reshape(1, img_size, img_size, 1)
  return img_resized

# Fungsi prediksi untuk dipanggil dari Flask
def predict_image(image_path):
  img_arr = preprocess_image(image_path)

  start_time = time.time()
  result = model.predict(img_arr)[0][0]
  elapsed_time = time.time() - start_time

  predicted_label = 1 if result >= 0.5 else 0  # 1 = infected, 0 = uninfected

  return {
    "predicted_label": int(predicted_label),
    "probability": float(result),
    "elapsed_time": round(elapsed_time, 4)
  }
