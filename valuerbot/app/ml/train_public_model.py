import pandas as pd
from xgboost import XGBRegressor
import joblib


data = pd.read_csv("data/land_prices_of_colombo.csv")


data["Price per Perch"] = (
    data["Price per Perch"]
    .astype(str)
    .str.replace(",", "", regex=False)
    .astype(float)
)


X = data[[
    "Distance from fort",
    "count_schools",
    "count_uni",
    "min_dist_uni",
    "min_dist_nearest_express",
    "min_dist_nearest_railway",
    "min_dist_nearest_bank",
    "count_banks_within_2km",
    "count_medical_centers",
    "min_dist_nearest_Supermarket",
    "count_Supermarkets_within2km",
    "min_dist_nearest_Fuel_station",
    "count_Fuel_Stations_within2km",
    "min_dist_school",
    "min_dist_medical_center"
]]


y = data["Price per Perch"]


model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)


model.fit(X, y)


joblib.dump(model, "models/valuation_model.pkl")

print("Model trained successfully!!")