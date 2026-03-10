from fastapi import APIRouter
from app.schemas.property_schema import PropertyInput
from app.utils.feature_builder import build_features
from app.ml.predict_official import predict_official

router = APIRouter()

@router.post("/official/estimate")

def estimate_official(data: PropertyInput):

    features = build_features(
        data.latitude,
        data.longitude,
        data.land_size
    )

    price = predict_official(features)

    return {"official_estimated_price": price}