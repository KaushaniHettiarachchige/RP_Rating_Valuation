import osmnx as ox
from geopy.distance import geodesic

from .facility_service import get_supermarkets, get_schools

def nearest_town_distance(lat, lon):

    tags = {"place": "town"}
    towns = ox.features_from_point((lat, lon), tags=tags, dist=20000)

    nearest = 999

    for idx, town in towns.iterrows():

        town_point = (town.geometry.centroid.y,
                      town.geometry.centroid.x)

        d = geodesic((lat, lon), town_point).km

        if d < nearest:
            nearest = d

    return nearest


def accessibility_score(lat, lon):

    town_dist = nearest_town_distance(lat, lon)

    supermarkets = get_supermarkets(lat, lon)
    schools = get_schools(lat, lon)

    town_score = 1/(1+town_dist)
    supermarket_score = min(supermarkets/5,1)
    school_score = min(schools/5,1)

    score = (
        0.4 * town_score +
        0.3 * supermarket_score +
        0.3 * school_score
    )

    return score