# import numpy as np
# from PIL import Image
# import io
# import os

# def load_image(file_or_path, size=(224, 224)):
#     """
#     Step 3: Preprocess the Image
#     - Loads the image from a file object, byte array, or local file path.
#     - Resizes the image into a fixed size (e.g. 224x224).
#     - Normalizes pixel values to be between 0 and 1.
#     - Prepares the image in model-readable format by expanding dimensions to (1, H, W, C).
#     """
#     # 1. Load image based on input type
#     if isinstance(file_or_path, str) and os.path.exists(file_or_path):
#         # File path
#         img = Image.open(file_or_path).convert("RGB")
#     elif isinstance(file_or_path, bytes):
#         # Byte array
#         img = Image.open(io.BytesIO(file_or_path)).convert("RGB")
#     else:
#         # File-like object (e.g., from FastAPI UploadFile)
#         img = Image.open(file_or_path).convert("RGB")
        
#     # 2. Resizing image into fixed size with standard filter (Matches Keras default)
#     img = img.resize(size, Image.BILINEAR)
    
#     # 3. Converting to array (Keep 0-255 values, EfficientNet handles internally)
#     arr = np.asarray(img).astype("float32")
    
#     # 4. Preparing in model-readable format
#     arr = np.expand_dims(arr, axis=0)  # Shape becomes (1, H, W, 3)
    
#     return arr

import numpy as np
from PIL import Image

def load_image(file, size=(224, 224)):
    img = Image.open(file).convert("RGB")
    img = img.resize(size)
    arr = np.asarray(img).astype("float32")
    arr = np.expand_dims(arr, axis=0)  # (1,H,W,3)
    return arr