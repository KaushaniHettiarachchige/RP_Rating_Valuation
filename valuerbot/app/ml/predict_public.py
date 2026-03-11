import joblib
import numpy as np

model = joblib.load("models/public_model.pkl")

def predict_public(features):

    features = np.array(features).reshape(1,-1)

    return float(model.predict(features)[0])