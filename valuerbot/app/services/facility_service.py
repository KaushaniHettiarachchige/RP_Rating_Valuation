import osmnx as ox

def get_supermarkets(lat, lon):
    tags = {"shop": "supermarket"}
    data = ox.features_from_point((lat, lon), tags=tags, dist=3000)
    return len(data)

def get_schools(lat, lon):
    tags = {"amenity": "school"}
    data = ox.features_from_point((lat, lon), tags=tags, dist=5000)
    return len(data)

def get_hospitals(lat, lon):
    tags = {"amenity": "hospital"}
    data = ox.features_from_point((lat, lon), tags=tags, dist=10000)
    return data