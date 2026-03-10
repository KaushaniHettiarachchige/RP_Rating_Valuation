from fastapi import APIRouter
from app.schemas.property_schema import PropertyInput
from app.utils.feature_builder import build_features
from app.ml.predict_public import predict_public

router = APIRouter()

@router.post("/public/estimate")

def estimate_public(data: PropertyInput):

    features = build_features(
        data.latitude,
        data.longitude,
        data.land_size
    )

    # price = predict_public(features)

    return {"features": features}
    
