from fastapi import APIRouter
from app.schemas.property_schema import PropertyInput
from app.utils.feature_builder import build_features
from app.ml.predict_public import predict_public

router = APIRouter()

@router.post("/public/valuate")

def estimate_public(data: PropertyInput):
    print("clicked")

    features = build_features(
        data.latitude,
        data.longitude,
        data.land_size
    )

    price = predict_public(features)
    feature_names = {
        "land_size": features[0],
        "accessibility_score": features[1],
        "supermarkets": features[2],
        "schools": features[3],
        "hospital_distance": features[4],
        "town_distance": features[5],
        "expressway_distance": features[6],
        "mainroad_distance": features[7],
        "universities": features[8],
        "airport_distance": features[9],
        "harbor_distance": features[10]
    }

    return {
        "public_estimated_price": price,
        "features": feature_names
    }
   
    
