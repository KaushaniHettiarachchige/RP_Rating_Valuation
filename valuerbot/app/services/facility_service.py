import osmnx as ox
from geopy.distance import geodesic

def get_supermarkets(lat, lon):
    tags = {"shop": "supermarket"}
    data = ox.features_from_point((lat, lon), tags=tags, dist=3000)
    return len(data)

def get_schools(lat, lon):
    tags = {"amenity": "school"}
    data = ox.features_from_point((lat, lon), tags=tags, dist=5000)
    return len(data)


def nearest_distance(lat, lon, tags, radius=10000):
    
    features = ox.features_from_point((lat, lon), tags=tags, dist=radius)
    if features.empty:
        return None
    nearest = min(
        geodesic((lat, lon), (row.geometry.centroid.y, row.geometry.centroid.x)).km
        for idx, row in features.iterrows()
    )
    return nearest

def get_nearest_town_distance(lat, lon):
    tags = {"place": "town"}
    return nearest_distance(lat, lon, tags, radius=20000)

def get_nearest_expressway(lat, lon):
    tags = {"highway": "motorway"}
    return nearest_distance(lat, lon, tags, radius=50000)

def get_nearest_mainroad(lat, lon):
    tags = {"highway": ["primary", "secondary"]}
    return nearest_distance(lat, lon, tags, radius=20000)

def get_universities_count(lat, lon):
    tags = {"amenity": "university"}
    data = ox.features_from_point((lat, lon), tags=tags, dist=20000)
    return len(data)

def get_nearest_airport(lat, lon):
    tags = {"aeroway": "aerodrome"}
    return nearest_distance(lat, lon, tags, radius=50000)

def get_nearest_harbor(lat, lon):
    tags = {"harbour": True}
    return nearest_distance(lat, lon, tags, radius=50000)

def get_nearest_hospital(lat, lon):
    tags = {"amenity": "hospital"}
    return nearest_distance(lat, lon, tags, radius=15000)