from fastapi import FastAPI
import joblib
from qgis_utils import calculate_features

app = FastAPI(title="Property Valuation API")

# Load regression model
model = joblib.load("models/regression_model.pkl")

@app.post("/estimate")
def estimate_from_location(lon: float, lat: float, eol: float):
    dtmr, zone_type, aop_score, lop_score = calculate_features(lon, lat)

    # Predict land value
    X = [[aop_score, lop_score, eol, dtmr]]
    predicted_value = model.predict(X)[0]

    return {
        "EOL": eol,
        "DTMR": dtmr,
        "AOP": aop_score,
        "LOP": lop_score,
        "zone_type": zone_type,
        "predicted_value": round(float(predicted_value), 2)
    }
