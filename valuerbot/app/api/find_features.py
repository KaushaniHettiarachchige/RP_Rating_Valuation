from fastapi import APIRouter
from app.schemas.property_schema import PropertyInput
from app.services.osm_features import (
    fetch_all_features,
    extract_feature_values,
   
)
from app.ml.predict_public import predict_public

router = APIRouter()


@router.post("/public/estimate")
def find_public(data: PropertyInput):


    osm_data = fetch_all_features(data.latitude, data.longitude)


    features = extract_feature_values(
        data.latitude,
        data.longitude,
        osm_data
    )

 
    
   
    feature_vector = [
      
        features.get("distance_to_fort_km", 0),
        features.get("count_schools", 0),
        features.get("count_uni", 0),
        features.get("min_dist_uni", 0),
        features.get("min_dist_nearest_express", 0),
        features.get("min_dist_nearest_railway", 0),
        features.get("min_dist_nearest_bank", 0),
        features.get("count_banks_within_2km", 0),
        features.get("count_medical_centers", 0),
        features.get("min_dist_nearest_Supermarket", 0),
        features.get("count_Supermarkets_within2km", 0),
        features.get("min_dist_nearest_Fuel_station", 0),
        features.get("count_Fuel_Stations_within2km", 0),
        features.get("min_dist_school", 0),
        features.get("min_dist_medical_center", 0)
    ]

  
 
    prediction = predict_public(feature_vector)

    return {
        "price_per_perch": prediction["price_per_perch"],
        "total_price": prediction["price_per_perch"] * data.land_size,
        "features": features,
       
    }