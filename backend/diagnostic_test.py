import tensorflow as tf
import numpy as np
from PIL import Image
import sys

def test_model(img_path):
    model = tf.keras.models.load_model("models/sat_model.keras")
    classes = ["bare_lands", "buildings", "vegetations"]
    
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224))
    
    tests = []
    for size in [(224, 224), (128, 128)]:
        img_resized = img.resize(size, Image.LANCZOS)
        arr_rgb_255 = np.expand_dims(np.array(img_resized).astype("float32"), axis=0)
        tests.append((f"RGB 0-255 {size}", arr_rgb_255))
        tests.append((f"RGB 0-1   {size}", arr_rgb_255 / 255.0))
        
        arr_bgr_255 = arr_rgb_255[:, :, :, ::-1]
        tests.append((f"BGR 0-255 {size}", arr_bgr_255))
        tests.append((f"BGR 0-1   {size}", arr_bgr_255 / 255.0))
    
    print(f"Testing against model: {model.name if hasattr(model, 'name') else 'Unknown'}")
    for name, arr in tests:
        try:
            preds = model.predict(arr, verbose=0)[0]
            idx = np.argmax(preds)
            print(f"{name} -> Class: {classes[idx]} ({preds[idx]:.4f}) | Scores: {preds}")
        except Exception as e:
            print(f"{name} -> FAILED: {e}")

if __name__ == "__main__":
    # Take image path from arg
    test_model(sys.argv[1])
