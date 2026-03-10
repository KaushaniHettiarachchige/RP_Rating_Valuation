import joblib
import numpy as np

model = joblib.load("models/official_model.pkl")

def predict_official(features):

    features = np.array(features).reshape(1,-1)

    return float(model.predict(features)[0])