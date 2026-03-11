import osmnx as ox
from geopy.distance import geodesic
from osmnx._errors import InsufficientResponseError

OSM_DATA = None


def fetch_all_features(lat, lon):
    global OSM_DATA

    tags = {
        "shop": "supermarket",
        "amenity": ["school", "university", "hospital"],
        "place": "town",
        "highway": ["motorway", "primary", "secondary"],
        "aeroway": "aerodrome",
        "harbour": True
    }

    try:
        print("Fetching all OSM features...")
        OSM_DATA = ox.features_from_point((lat, lon), tags=tags, dist=25000)
        print("Total features fetched:", len(OSM_DATA))
    except InsufficientResponseError:
        print("OSM fetch failed")
        OSM_DATA = None


def count_features(key, value, name):
    if OSM_DATA is None:
        print(name, "data not loaded")
        return 0

    try:
        subset = OSM_DATA[OSM_DATA[key] == value]
        print(name, "count:", len(subset))
        return len(subset)
    except:
        print(name, "count error")
        return 0


def nearest_distance(lat, lon, key, value, name):
    if OSM_DATA is None:
        print(name, "data not loaded")
        return None

    try:
        subset = OSM_DATA[OSM_DATA[key] == value]

        if subset.empty:
            print(name, "not found")
            return None

        nearest = min(
            geodesic(
                (lat, lon),
                (row.geometry.centroid.y, row.geometry.centroid.x)
            ).km
            for _, row in subset.iterrows()
        )

        print(name, "nearest distance:", round(nearest, 2), "km")
        return nearest

    except Exception as e:
        print(name, "error:", e)
        return None


# -------- Feature Functions --------

def get_supermarkets():
    return count_features("shop", "supermarket", "Supermarkets")


def get_schools():
    return count_features("amenity", "school", "Schools")


def get_universities_count():
    return count_features("amenity", "university", "Universities")


def get_nearest_hospital(lat, lon):
    return nearest_distance(lat, lon, "amenity", "hospital", "Hospital")


def get_nearest_town_distance(lat, lon):
    return nearest_distance(lat, lon, "place", "town", "Town")


def get_nearest_expressway(lat, lon):
    return nearest_distance(lat, lon, "highway", "motorway", "Expressway")


def get_nearest_mainroad(lat, lon):
    return nearest_distance(lat, lon, "highway", "primary", "Main Road")


def get_nearest_airport(lat, lon):
    return nearest_distance(lat, lon, "aeroway", "aerodrome", "Airport")


def get_nearest_harbor(lat, lon):
    return nearest_distance(lat, lon, "harbour", True, "Harbor")