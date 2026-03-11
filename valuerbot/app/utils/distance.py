from geopy.distance import geodesic

def calculate_distance(p1, p2):
    return geodesic(p1, p2).km
