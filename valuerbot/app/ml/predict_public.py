import joblib
import numpy as np

model = joblib.load("models/valuation_model.pkl")


def predict_public(features):
    try:
        features = np.array(features, dtype=float).reshape(1, -1)

        price = model.predict(features)[0]

        return {
            "price_per_perch": float(price)
        }

    except Exception as e:
        return {"error": str(e)}