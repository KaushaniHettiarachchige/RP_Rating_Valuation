from PIL import Image
import numpy as np
img = Image.fromarray(np.random.randint(0, 255, (128, 128, 3), dtype=np.uint8))
img.save("test_sat.jpg")
