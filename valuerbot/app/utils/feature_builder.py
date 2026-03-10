from app.services.accessibility_service import accessibility_score
from app.services.facility_service import get_supermarkets, get_schools

def build_features(lat, lon, land_size):

    supermarkets = get_supermarkets(lat, lon)
    schools = get_schools(lat, lon)

    access = accessibility_score(lat, lon)

    features = [
        land_size,
        access,
        supermarkets,
        schools
    ]

    return features