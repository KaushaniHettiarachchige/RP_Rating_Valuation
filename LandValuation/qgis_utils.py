from qgis.core import QgsVectorLayer, QgsPointXY, QgsGeometry
from utils import get_aop_score, get_lop_score


road_layer = QgsVectorLayer("data/main_roads.shp", "roads", "ogr")
zone_layer = QgsVectorLayer("data/zones.shp", "zones", "ogr")

def calculate_features(lon, lat):
 
    user_point = QgsGeometry.fromPointXY(QgsPointXY(lon, lat))

 
    dtmr = min([user_point.distance(r.geometry()) for r in road_layer.getFeatures()])


    zone_feature = [z for z in zone_layer.getFeatures() if z.geometry().contains(user_point)][0]
    zone_type = zone_feature["zone_name"]

 
    aop_score = get_aop_score(dtmr)
    lop_score = get_lop_score(zone_type)

    return dtmr, zone_type, aop_score, lop_score
