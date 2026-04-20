from app.services.accessibility_service import accessibility_score
from app.services.facility_service import (
    fetch_all_features,
    get_supermarkets,
    get_schools,
    get_nearest_hospital,
    get_nearest_town_distance,
    get_nearest_expressway,
    get_nearest_mainroad,
    get_universities_count,
    get_nearest_airport,
    get_nearest_harbor
)

def build_features(lat, lon, land_size):

   
    fetch_all_features(lat, lon)

    supermarkets = get_supermarkets()
    schools = get_schools()
    hospital_dist = get_nearest_hospital(lat, lon)

    town_dist = get_nearest_town_distance(lat, lon)
    expressway_dist = get_nearest_expressway(lat, lon)
    mainroad_dist = get_nearest_mainroad(lat, lon)
    universities = get_universities_count()
    airport_dist = get_nearest_airport(lat, lon)
    harbor_dist = get_nearest_harbor(lat, lon)


    # access = accessibility_score(lat, lon)

    features = [
        land_size,
        # access,
        supermarkets,
        schools,
        hospital_dist,
        town_dist,
        expressway_dist,
        mainroad_dist,
        universities,
        airport_dist,
        harbor_dist
    ]

    return features