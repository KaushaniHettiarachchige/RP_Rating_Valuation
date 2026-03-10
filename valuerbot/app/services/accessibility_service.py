from .facility_service import (
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

def accessibility_score(lat, lon):

    # 🔹 Fetch OSM features once
    fetch_all_features(lat, lon)

    # facility counts (no coordinates needed)
    supermarkets = get_supermarkets()
    schools = get_schools()
    universities = get_universities_count()

    # distances (still need lat, lon)
    hospital_dist = get_nearest_hospital(lat, lon)
    town_dist = get_nearest_town_distance(lat, lon)
    expressway_dist = get_nearest_expressway(lat, lon)
    mainroad_dist = get_nearest_mainroad(lat, lon)
    airport_dist = get_nearest_airport(lat, lon)
    harbor_dist = get_nearest_harbor(lat, lon)

    # normalize distance scores (closer = higher score)
    hospital_score = 1 / (1 + hospital_dist) if hospital_dist else 0
    town_score = 1 / (1 + town_dist) if town_dist else 0
    expressway_score = 1 / (1 + expressway_dist) if expressway_dist else 0
    mainroad_score = 1 / (1 + mainroad_dist) if mainroad_dist else 0
    airport_score = 1 / (1 + airport_dist) if airport_dist else 0
    harbor_score = 1 / (1 + harbor_dist) if harbor_dist else 0

    # normalize count scores
    supermarket_score = min(supermarkets / 5, 1)
    school_score = min(schools / 5, 1)
    university_score = min(universities / 5, 1)

    # weighted accessibility score
    score = (
        0.2 * town_score +
        0.15 * supermarket_score +
        0.15 * school_score +
        0.1 * hospital_score +
        0.1 * expressway_score +
        0.1 * mainroad_score +
        0.1 * university_score +
        0.05 * airport_score +
        0.05 * harbor_score
    )

    return score