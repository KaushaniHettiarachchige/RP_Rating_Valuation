import numpy as np
from PIL import Image
import os

def save_preprocessed(img_path, size=(224, 224)):
    img = Image.open(img_path).convert("RGB")
    # Test 224
    img224 = img.resize((224, 224), Image.LANCZOS)
    img224.save("test_224.png")
    
    # Test 128
    img128 = img.resize((128, 128), Image.LANCZOS)
    img128.save("test_128.png")
    
    print("Saved test_224.png and test_128.png")

if __name__ == "__main__":
    if os.path.exists("test_sat.jpg"):
        save_preprocessed("test_sat.jpg")
    else:
        print("test_sat.jpg not found")
