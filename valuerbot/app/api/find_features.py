from fastapi import APIRouter
from app.schemas.property_schema import PropertyInput
from app.services.osm_features import fetch_all_features, extract_feature_values,extract_places


router = APIRouter()


@router.post("/public/find")
def find_public(data: PropertyInput):
    print("clicked")

    # ✅ STEP 1: LOAD OSM DATA FIRST
    osm_data=fetch_all_features(data.latitude, data.longitude)

    # ✅ STEP 2: EXTRACT FEATURES
    result = extract_feature_values(
        data.latitude,
        data.longitude,
        osm_data
    )
    places = extract_places(
        data.latitude,
        data.longitude,
        osm_data
    )

    return {
        "features": result,
        "places":places
     
    }