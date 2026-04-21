import numpy as np
import osmnx as ox
import math
from geopy.distance import geodesic
from osmnx._errors import InsufficientResponseError

OSM_DATA = None


FORT_LOCATION = (6.9344, 79.8428)


def fetch_all_features(lat, lon):
    global OSM_DATA

    try:
        tags = {
            "amenity": ["school", "university", "hospital", "bank", "fuel"],
            "shop": "supermarket",
            "highway": ["motorway"],
            "railway": "station",
            "place": ["city", "town",],
            "healthcare": True,
            "landuse": True,
            
        }

        OSM_DATA = ox.features_from_point((lat, lon), tags=tags, dist=10000)
        print(f"OSM Loaded: {len(OSM_DATA)} features")
        return OSM_DATA

    except Exception as e:
        print("OSM fetch failed:", e)
        OSM_DATA = None



def clean_json(obj):
    if isinstance(obj, dict):
        return {k: clean_json(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [clean_json(v) for v in obj]

    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None

    return obj



def safe_distance(lat, lon, geom):
    try:
        if geom is None:
            return None

        if geom.geom_type == "Point":
            p = (geom.y, geom.x)
        else:
            c = geom.centroid
            p = (c.y, c.x)

        return geodesic((lat, lon), p).km

    except Exception:
        return None


def distance_to_fort(lat, lon):
    try:
        return geodesic((lat, lon), FORT_LOCATION).km
    except Exception:
        return None


def safe_filter(df, column, value):
    try:
        if df is None or df.empty:
            return df.iloc[0:0]

        if column not in df.columns:
            return df.iloc[0:0]

        return df[df[column].fillna("") == value]

    except Exception:
        return None



def min_distance(df, lat, lon):
    try:
        if df is None or df.empty:
            return None

        values = [
            safe_distance(lat, lon, r.geometry)
            for _, r in df.iterrows()
            if r.geometry is not None
        ]

        values = [v for v in values if v is not None]
        return min(values) if values else None

    except Exception:
        return None



def count_within(df, lat, lon, km):
    try:
        if df is None or df.empty:
            return 0

        count = 0

        for _, r in df.iterrows():
            if r.geometry is None:
                continue

            name = r.get("name")

            if not valid_name(name):
                continue

            dist = safe_distance(lat, lon, r.geometry)

            if dist is not None and dist <= km:
                count += 1

        return count

    except Exception:
        return 0



def valid_name(name):
    return name and str(name).strip().lower() not in ["nan", "none", ""]



def get_places(df, lat, lon, radius_km):
    try:
        if df is None or df.empty:
            return []

        results = []

        for _, r in df.iterrows():
            if r.geometry is None:
                continue

            name = r.get("name")
            if not valid_name(name):
                continue

            dist = safe_distance(lat, lon, r.geometry)

            # skip if distance invalid or outside radius
            if dist is None or dist > radius_km:
                continue

            geom = r.geometry

            if geom.geom_type == "Point":
                p_lat, p_lon = geom.y, geom.x
            else:
                c = geom.centroid
                p_lat, p_lon = c.y, c.x

            results.append({
                "name": name,
                "distance_km": round(dist, 3),
                "lat": float(p_lat),
                "lon": float(p_lon)
            })

        return results

    except Exception:
        return []



def get_nearest_town(lat, lon, data):
    try:
        if data is None or data.empty:
            return "Unknown"

        if "place" not in data.columns:
            return "Unknown"

        places_df = data[data["place"].notna()]

        if places_df.empty:
            return "Unknown"

        nearest_name = None
        min_dist = float("inf")

        for _, r in places_df.iterrows():
            if r.geometry is None:
                continue

            name = r.get("name")
            if not valid_name(name):
                continue

            dist = safe_distance(lat, lon, r.geometry)

            if dist is not None and dist < min_dist:
                min_dist = dist
                nearest_name = name

        return nearest_name if nearest_name else "Unknown"

    except Exception:
        return "Unknown"    

def extract_feature_values(lat, lon, data):
    if data is None:
        return {}

    features = {}

    schools = safe_filter(data, "amenity", "school")
    features["count_schools"] = count_within(schools, lat, lon, 3)
    features["min_dist_school"] = min_distance(schools, lat, lon)

    uni = safe_filter(data, "amenity", "university")
    features["count_uni"] = count_within(uni, lat, lon, 5)
    features["min_dist_uni"] = min_distance(uni, lat, lon)

    rail = safe_filter(data, "railway", "station")
    features["min_dist_nearest_railway"] = min_distance(rail, lat, lon)

    highway = safe_filter(data, "highway", "motorway")
    features["min_dist_nearest_express"] = min_distance(highway, lat, lon)

    banks = safe_filter(data, "amenity", "bank")
    features["count_banks_within_2km"] = count_within(banks, lat, lon, 2)
    features["min_dist_nearest_bank"] = min_distance(banks, lat, lon)

    markets = safe_filter(data, "shop", "supermarket")
    features["count_Supermarkets_within2km"] = count_within(markets, lat, lon, 2)
    features["min_dist_nearest_Supermarket"] = min_distance(markets, lat, lon)

    fuel = safe_filter(data, "amenity", "fuel")
    features["count_Fuel_Stations_within2km"] = count_within(fuel, lat, lon, 2)
    features["min_dist_nearest_Fuel_station"] = min_distance(fuel, lat, lon)

    hospitals = safe_filter(data, "amenity", "hospital")
    features["count_medical_centers"] = count_within(hospitals, lat, lon, 5)
    features["min_dist_medical_center"] = min_distance(hospitals, lat, lon)

    features["distance_to_fort_km"] = distance_to_fort(lat, lon)


   

    return features




def extract_places(lat, lon, data):
    if data is None:
        return {}

    places = {}

    places["schools"] = get_places(safe_filter(data, "amenity", "school"), lat, lon, 3)
    places["universities"] = get_places(safe_filter(data, "amenity", "university"), lat, lon, 5)
    places["railway_stations"] = get_places(safe_filter(data, "railway", "station"), lat, lon, 5)
    places["banks"] = get_places(safe_filter(data, "amenity", "bank"), lat, lon, 2)
    places["supermarkets"] = get_places(safe_filter(data, "shop", "supermarket"), lat, lon, 2)
    places["fuel_stations"] = get_places(safe_filter(data, "amenity", "fuel"), lat, lon, 2)
    places["hospitals"] = get_places(safe_filter(data, "amenity", "hospital"), lat, lon, 5)
    places["nearest_town"] = get_nearest_town(lat, lon, data)

    return places