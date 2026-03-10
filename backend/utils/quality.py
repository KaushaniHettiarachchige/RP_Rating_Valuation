import numpy as np
from PIL import Image
from io import BytesIO

def blur_score(file_obj):
    img = Image.open(file_obj).convert("L")
    arr = np.array(img, dtype=np.float32)

    # simple Laplacian variance blur metric
    lap = np.abs(np.gradient(arr)[0]) + np.abs(np.gradient(arr)[1])
    return float(np.var(lap))