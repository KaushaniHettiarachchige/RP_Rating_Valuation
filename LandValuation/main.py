from fastapi import FastAPI
import joblib
from qgis_utils import calculate_features

app = FastAPI(title="Property Valuation API")


model = joblib.load("models/regression_model.pkl")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/estimate")
def estimate_from_location(lon: float, lat: float, eol: float):
    
    dtmr, zone_type, aop_score, lop_score = calculate_features(lon, lat)

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
