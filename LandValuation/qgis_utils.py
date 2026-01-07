from qgis.core import QgsVectorLayer, QgsPointXY, QgsGeometry
from utils import get_aop_score, get_lop_score
import os


# ---- Load Roads Shapefile ----
# Use absolute path for safety (recommended)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROADS_PATH = os.path.join(BASE_DIR, "data", "roads.shp")

road_layer = QgsVectorLayer(ROADS_PATH, "roads", "ogr")

print("Loading roads layer from:", ROADS_PATH)
print("Valid?", road_layer.isValid())
print("Feature count:", road_layer.featureCount())


def calculate_features(lon, lat):
 

    if not road_layer.isValid():
        raise Exception("Road layer failed to load. Check the file path.")

    features = list(road_layer.getFeatures())

    if not features:
        raise Exception("Road layer has 0 features. Check the shapefile.")

    user_point = QgsGeometry.fromPointXY(QgsPointXY(lon, lat))

 
    dtmr = min(user_point.distance(r.geometry()) for r in features)

 
    zone_type = "residential"

    aop_score = get_aop_score(dtmr)
    lop_score = get_lop_score(zone_type)

    return dtmr, zone_type, aop_score, lop_score
