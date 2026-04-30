import osmnx as ox
from geopy.distance import geodesic
from osmnx._errors import InsufficientResponseError

OSM_DATA = None


def fetch_all_features(lat, lon):
    global OSM_DATA

    tags = {
        "shop": "supermarket",
        "amenity": ["school", "university", "hospital", "port"],
        "place": "town",
        "highway": ["motorway", "primary", "secondary"],
        "aeroway": "aerodrome",
    }

    try:
        print("Fetching all OSM features...")
        OSM_DATA = ox.features_from_point((lat, lon), tags=tags, dist=5000)
        print("Total features fetched:", len(OSM_DATA))
    except InsufficientResponseError:
        print("OSM fetch failed")
        OSM_DATA = None


def count_features(key, value, name):
    if OSM_DATA is None:
        return {"count": 0, "places": []}

    try:
        if key not in OSM_DATA.columns:
            return {"count": 0, "places": []}

        subset = OSM_DATA[OSM_DATA[key] == value]

       
        if "name" in subset.columns:
            subset = subset.dropna(subset=["name"])

        places = []

        for _, row in subset.iterrows():
            geom = row.geometry

          
            if geom.geom_type == "Point":
                lat = geom.y
                lon = geom.x
            else:
                center = geom.centroid
                lat = center.y
                lon = center.x

            places.append({
                "name": row["name"],
                "lat": lat,
                "lon": lon
            })

        return {
            "count": len(places),
            "places": places
        }

    except Exception as e:
        print(name, "error:", e)
        return {"count": 0, "places": []}


def nearest_distance(lat, lon, key, value, name):
    if OSM_DATA is None:
        print(name, "data not loaded")
        return None

    try:
        if key not in OSM_DATA.columns:
            print(f"{name}: column '{key}' not found")
            return None

        subset = OSM_DATA[OSM_DATA[key] == value]

        if subset.empty:
            print(name, "not found")
            return None

        distances = []

        for _, row in subset.iterrows():
            geom = row.geometry

           
            if geom.geom_type == "Point":
                point = geom
            else:
                point = geom.centroid

            dist = geodesic((lat, lon), (point.y, point.x)).km
            distances.append(dist)

        nearest = min(distances)

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
    return nearest_distance(lat, lon, "amenity", "port", "Harbor")



def classify_landuse(tag):
    if not tag:
        return "others"

    tag = tag.lower()

    if tag == "residential":
        return "residential"

    elif tag in ["commercial", "retail"]:
        return "commercial"

    elif tag == "industrial":
        return "industrial"

    elif tag in ["farmland", "farm", "orchard", "vineyard", "meadow", "agriculture"]:
        return "agriculture"

    else:
        return "others"


def get_landuse_type(lat, lon):
    global OSM_DATA

    try:
        print("Fetching landuse data...")
        gdf = ox.features_from_point(
            (lat, lon),
            tags={"landuse": True},
            dist=500
        )
    except InsufficientResponseError:
        return "others"

    if gdf.empty:
        return "others"

    from shapely.geometry import Point
    pt = Point(lon, lat)

    
    matches = gdf[gdf.geometry.contains(pt)]

    if matches.empty:
        return "others"

    row = matches.iloc[0]
    landuse_tag = row.get("landuse")

   
    return classify_landuse(landuse_tag)