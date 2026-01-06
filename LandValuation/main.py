from fastapi import FastAPI
import joblib
from utils import get_aop_score, get_lop_score

app = FastAPI(title="Property Valuation API")


model = joblib.load("models/regression_model.pkl")

@app.get("/")

def home():
    return {"status": "Property Valuation API running"}

@app.post("/estimate")

def estimate(eol: float, distance: float, zone: str, dtmr: float):

  
    AOP = get_aop_score(distance)
    LOP = get_lop_score(zone)

   
    X = [[AOP, LOP, eol, dtmr]]
    predicted_value = model.predict(X)[0]

    return {
        "AOP_score": AOP,
        "LOP_score": LOP,
        "EOL": eol,
        "DTMR": dtmr,
        "estimated_value": round(float(predicted_value), 2)
    }

