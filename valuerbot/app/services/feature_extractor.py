import pandas as pd
from tqdm import tqdm

from osm_features import (
    fetch_all_features,
    extract_feature_values
)

class FeatureExtractionModule:

    def __init__(self):
        self.osm_cache = {}

    def load_osm(self, lat, lon):
        """
        Load OSM once per area (basic caching)
        """
        key = (round(lat, 3), round(lon, 3))

        if key not in self.osm_cache:
            self.osm_cache[key] = fetch_all_features(lat, lon)

        return self.osm_cache[key]

    def process_csv(self, input_csv_path, output_csv_path):
        """
        Main pipeline:
        CSV -> Feature Extraction -> New CSV
        """

        df = pd.read_csv(input_csv_path)

        required_cols = ["lat", "lon", "value"]
        for col in required_cols:
            if col not in df.columns:
                raise ValueError(f"Missing required column: {col}")

        feature_rows = []

        print("🚀 Starting Feature Extraction...")

        for _, row in tqdm(df.iterrows(), total=len(df)):

            lat = float(row["lat"])
            lon = float(row["lon"])
            value = row["value"]

          
            osm_data = self.load_osm(lat, lon)

           
            features = extract_feature_values(lat, lon, osm_data)

           
            new_row = {
                "lat": lat,
                "lon": lon,
                "value": value,
                **features
            }

            feature_rows.append(new_row)


        result_df = pd.DataFrame(feature_rows)

        result_df.to_csv(output_csv_path, index=False)

        print(f"✅ Feature dataset saved to: {output_csv_path}")

        return result_df